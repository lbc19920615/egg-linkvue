const _ = require('lodash');
const Controller = require('egg').Controller;

const sass = require('sass');
const axios = require('axios');
const urlResolve = require('url-resolve-browser');

const { parseComponent } = require('vue-sfc-parser');
const Twig = require('twig');
function renderTwig(data, params = {}) {
  return Twig.twig({
    data,
  }).render(params);
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

function getObjColunms(obj = new Map(), name = 'source') {
  const ret = [];
  // obj.forEach( value => {
  //   if (value[name]) {
  //     ret.push(value[name]);
  //   }
  // });
  // eslint-disable-next-line no-unused-vars
  for (const [ key, value ] of obj) {
    if (value[name]) {
      value[name].CONFIG_ID = key;
      ret.push(value[name]);
    }
  }
  return ret;
}

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
            console.log(content);
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
  async index() {
    const { ctx } = this;
    const configMap = new Map();
    // eslint-disable-next-line no-unused-vars
    const config = loadDeepConfig(ctx, 'config.json5', configMap);

    // console.log(config.source);

    const sources = getObjColunms(configMap);

    const { name, version, description, author } = ctx.app.config.pkg;
    const pkginfo = {
      name,
      version,
      description,
      author,
      sources,
    };
    await ctx.render('index.twig', pkginfo);
  }
  async getscript() {
    const { ctx } = this;
    const file = ctx.loadFile(
      './public/render/' + ctx.request.query.src
    );

    ctx.body = file;
  }
  async getremote() {
    const { ctx } = this;
    const src = ctx.request.query.src ? ctx.request.query.src : '';
    const def = ctx.request.query.def ? ctx.request.query.def : '';
    const file = ctx.loadFile(
      './public/render/' + src
    );

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
