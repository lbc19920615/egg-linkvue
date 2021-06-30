const Controller = require('egg').Controller;


function loadDeepConfig(ctx, url, configMap) {
  const config = ctx.loadConfig(url);
  if (config.children) {
    // eslint-disable-next-line no-unused-vars
    Object.entries(config.children).forEach(([ key, childNode ]) => {
      // console.log('key', key, childNode);
      if (childNode && childNode.config) {
        loadDeepConfig(ctx, childNode.config, configMap);
      }
    });
  }
  configMap.set(config.id, config);
}

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const configMap = new Map();
    loadDeepConfig(ctx, 'config.json5', configMap);

    console.log(configMap);

    const { name, version, description, author } = ctx.app.config.pkg;
    const pkginfo = {
      name,
      version,
      description,
      author,
    };
    await ctx.render('home.twig', pkginfo);
  }
}

module.exports = HomeController;
