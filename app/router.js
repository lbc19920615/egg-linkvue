/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('index', '/', controller.home.index);
  // router.get('index', '/getscript', controller.home.getscript);
  // router.post('index', '/getscriptv2', controller.home.getscriptv2);
  // router.get('index', '/getcontent', controller.home.getContent);
  // router.get('index', '/getcontentv2', controller.home.getContentv2);
  // router.post('index', '/getcontentv3', controller.home.getContentV3);
  // router.get('index', '/cusstyle', controller.home.cusStyle);
  // router.get('index', '/getremote', controller.home.getremote);
  // router.get('index', '/getconfig', controller.home.getConfig);
  router.get('index', '/get-style', controller.home.getStyle);
  // router.get('index', '/cssstyle', controller.home.cssstyle);
  // router.get('index', '/login', controller.home.login);
  // app.router.redirect('/', '/home/index', 302);
};
