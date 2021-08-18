const _ = require('lodash');
const Controller = require('egg').Controller;

const formidable = require('formidable');

const qs = require('qs');
const JSON5 = require('json5');

const sass = require('sass');
const axios = require('axios');
const urlResolve = require('url-resolve-browser');

const replaceExt = require('replace-ext');


const Twig = require('twig');
Twig.cache(false);
async function renderTwig(path, params = {}) {
  return new Promise((resolve, reject) => {
    Twig.renderFile(path, params, (err, html) => {
      if (err) {
        reject(err);
      }
      resolve(html);
    });
  });
}

function loadDeepConfig(ctx, url, configMap) {
  const config = ctx.loadConfig(url);
  if (config.children) {
    // eslint-disable-next-line no-unused-vars
    _.forEach(config.children, childNode => {
      if (childNode && childNode.config) {
        loadDeepConfig(ctx, childNode.config, configMap);
      }
    });

  }
  // configMap[config.id] = config;
  configMap.set(config.id, config);
  return config;
}

// function getObjColunms(obj = new Map(), name = 'source') {
//   const ret = [];
//   // eslint-disable-next-line no-unused-vars
//   for (const [ key, value ] of obj) {
//     if (value[name]) {
//       value[name].CONFIG_ID = key;
//       ret.push(value[name]);
//     }
//   }
//   return ret;
// }

function resolveImportPath(url, content) {
  // eslint-disable-next-line no-unused-vars
  return content.replace(/@import[\s"]*([^"]*)"/g, function(match) {
    return match.replace(/"([^"]*)"/, function(p, p1) {
      const r = urlResolve('http://' + url, p1);
      // console.log(r, p1, match);
      const b = r.replace('http://', '');
      return `"${b}"`;
    });
  });
}

function rendeSass(filePath) {
  return new Promise(resolve => {
    sass.render({
      file: filePath,
      // eslint-disable-next-line no-unused-vars
      importer(url, prev, done) {
        if (url.startsWith('localhost')) {
          axios.get(`http://${url}`).then(res => {
            const content = resolveImportPath(url, res.data);
            // console.log(content);
            done({
              contents: content,
            });
          });
        }
      },
    }, function(err, result) {
      if (err) {
        console.log(err);
      }
      resolve(result.css.toString());
    });
  });
}

class HomeController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.configMap = new Map();
    loadDeepConfig(ctx, 'config.json5', this.configMap);
  }
  async login() {
    const { ctx } = this;
    const token = ctx.cookies.get('site_token', {
      httpOnly: true,
      signed: false,
    });
    // console.log('token', token);
    if (!token) {
      ctx.cookies.set('site_token', Date.now() + '');
      ctx.body = '';
    } else {
      ctx.redirect('/');
    }
  }
  async index() {
    const { ctx } = this;

    const token = ctx.cookies.get('site_token', {
      httpOnly: true,
      signed: false,
    });
    if (!token) {
      ctx.redirect('/login');
    }

    const { name, version, description, author } = ctx.app.config.pkg;
    const pkginfo = {
      name,
      version,
      description,
      author,
    };
    await ctx.render('index.twig', pkginfo);
  }
  async _parseContentV2(src, { append = {} } = {}) {
    const { ctx } = this;
    const fileurl = ctx.getAppFileUrl(
      './public/render/' + src
    );
    let file = '';

    file = await renderTwig(fileurl,
      Object.assign({}, append)
    );

    return file;
  }
  async _parseContent(src, configId = '', { append = {} } = {}) {
    const configMap = this.configMap;
    const { ctx } = this;
    const fileurl = ctx.getAppFileUrl(
      './public/render/' + src
    );
    let file = '';

    const params = (configId && configMap.has(configId)) ?
      configMap.get(configId) : {};

    if (params.needConfig) {
      params[params.needConfig] = JSON.stringify(params);
    }

    file = await renderTwig(fileurl,
      Object.assign({
      }, params, append)
    );

    // console.log('configId', params, file)
    // console.log(fileurl);
    return file;
  }
  async parse(req) {
    return new Promise(resolve => {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // console.log(fields.source)
        resolve({ fields, files });
      });
    });
  }
  async getContentV3() {
    const { ctx } = this;
    const src = ctx.request.query.src ? ctx.request.query.src : '';
    const configId = ctx.request.query.config_id ? ctx.request.query.config_id : '';
    // const config = ctx.request.query.config ? ctx.request.query.config : '';
    // const body = ctx.request.body ? ctx.request.body : {};
    // console.log( Object.keys(ctx.request.body) );
    // const source = Object.keys(ctx.request.body)[0c];
    // console.log(ctx.req);

    // console.log(ctx.protocol);

    const { fields } = await this.parse(ctx.req);
    ctx.body = await this._parseContent(src, configId, {
      append: {
        source: fields.source,
        CONFIG_SOURCE: fields.source,
        CONFIG_SOURCE_JSON5: JSON5.stringify(JSON.parse(fields.source)),
        CONFIG: JSON.parse(fields.source),
        APP_CONFIG: {
          server_origin: ctx.protocol + '://' + ctx.request.header.host,
          header: ctx.request.header,
        },
      },
    });

  }
  async getContent() {
    const { ctx } = this;
    const src = ctx.request.query.src ? ctx.request.query.src : '';
    const configId = ctx.request.query.config_id ? ctx.request.query.config_id : '';
    // const config = ctx.request.query.config ? ctx.request.query.config : '';
    ctx.body = await this._parseContent(src, configId);
  }
  async getContentv2() {
    const { ctx } = this;
    // const src = ctx.request.query.src ? ctx.request.query.src : '';
    // const configId = ctx.request.query.config_id ? ctx.request.query.config_id : '';
    // const config = ctx.request.query.config ? ctx.request.query.config : '';

    const arr = ctx.request.url.split('?');
    try {
      const query = qs.parse(arr[1]);
      const src = query.src ? query.src : '';
      const configId = query.config_id ? query.config_id : '';
      // console.dir(
      //   JSON.stringify(query)
      // );
      ctx.body = await this._parseContent(src, configId, {
        append: {
          source: query,
          tplSource: query,
        },
      });
    } catch (e) {
      console.error(e);
    }
    // ctx.body = await this._parseContent(src, configId);
  }
  async getConfig() {
    const { ctx } = this;
    const configId = ctx.request.query.config_id ? ctx.request.query.config_id : '';
    let configObj = {};
    if (configId) {
      const configMap = new Map();
      configObj = loadDeepConfig(ctx, configId, configMap);
    }
    ctx.set('Content-Type', 'application/javascript; charset=utf-8');
    ctx.body = `export default ${JSON.stringify(configObj)}`;
  }
  async getscriptv2() {
    const { ctx } = this;
    const src = ctx.request.query.src ? ctx.request.query.src : '';

    let content = '';
    const scriptPath = replaceExt(src, '.js');
    const tplPath = replaceExt(src, '.twig');
    const source = ctx.request.body ? ctx.request.body : {};
    const tpl = await this._parseContentV2(tplPath, {
      append: {
        source: JSON.stringify(source),
      },
    });
    const script = await this._parseContentV2(scriptPath, {
      append: {
        source: JSON.stringify(source),
        html: tpl,
      },
    });
    // console.log('tpl', tpl);
    content = script;
    ctx.set('Content-Type', 'application/javascript; charset=utf-8');
    ctx.body = content;
  }
  async getscript() {
    const { ctx } = this;
    const src = ctx.request.query.src ? ctx.request.query.src : '';
    const configId = ctx.request.query.config_id ? ctx.request.query.config_id : '';

    let content = '';
    if (src.endsWith('twigvue')) {
      const scriptPath = replaceExt(src, '.js');
      const tplPath = replaceExt(src, '.twig');
      let configObj = {
        html: '',
        source: {},
      };

      if (configId) {
        const configMap = new Map();
        configObj = loadDeepConfig(ctx, configId, configMap);
      }
      // console.log(configObj);
      const tpl = await this._parseContentV2(tplPath, {
        append: {
          config: configObj,
          source: JSON.stringify(configObj.source),
        },
      });
      const script = await this._parseContentV2(scriptPath, {
        append: {
          config: configObj,
          source: JSON.stringify(configObj.source),
          html: tpl,
        },
      });
      // console.log('tpl', tpl);
      content = script;
    } else {

      content = await this._parseContent(src, configId);
    }
    ctx.set('Content-Type', 'application/javascript; charset=utf-8');
    // ctx.body = 'export default `' + content + '`';
    ctx.body = content;
  }
  async getremote() {
    const { ctx } = this;
    const src = ctx.request.query.src ? ctx.request.query.src : '';
    const def = ctx.request.query.def ? ctx.request.query.def : '';
    const fileUrl = ctx.getAppFileUrl(
      './public/render/' + src
    );
    // if (src.endsWith('twig')) {
    const file = await renderTwig(fileUrl, {});
    // }
    // console.log(fileUrl, file);
    ctx.set('Content-Type', 'application/javascript; charset=utf-8');
    ctx.body = `
    ${def}.set('${src}', \`${file}\`)
    `;
  }
  async getstyle() {
    const { ctx } = this;
    let filePath = ctx.request.query.src;
    if (!ctx.helper.isValidHttpUrl(filePath)) {
      filePath = ctx.getAppFileUrl(ctx.request.query.src);
    }
    const css = await rendeSass(filePath);
    ctx.set('Content-Type', 'text/css; charset=utf-8');
    ctx.body = css;
  }
  async cssstyle() {
    const { ctx } = this;
    ctx.set('Content-Type', 'text/css; charset=utf-8');
    ctx.body = `body {
      background: red;
    }`;
  }
}

module.exports = HomeController;
