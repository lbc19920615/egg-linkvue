const _ = require('lodash');
const Controller = require('egg').Controller;

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

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const configMap = new Map();
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
    await ctx.render('home.twig', pkginfo);
  }
  async getscript() {
    const { ctx } = this;
    let content = ctx.loadFile(ctx.request.query.src);
    content = content.replace(/__BEFORE__/, `let ENV = { 
id: "${ctx.request.query.id}",
tplId: "#tpl-${ctx.request.query.id}" 
}`);
    ctx.set('Content-Type', 'application/javascript; charset=utf-8');
    ctx.body = content ? content : 'export default {}';
  }
}

module.exports = HomeController;
