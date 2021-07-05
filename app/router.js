/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('index', '/', controller.home.index);
  router.get('index', '/getscript', controller.home.getscript);
  router.get('index', '/getremote', controller.home.getremote);
  router.get('index', '/getstyle', controller.home.getstyle);
  router.get('index', '/cssstyle', controller.home.cssstyle);
  router.get('index', '/login', controller.home.login);
  // app.router.redirect('/', '/home/index', 302);
  router.get('/api/v1/wxactivity', controller.v1.wxactivity.show);
  router.post('/api/v1/wxactivity', controller.v1.wxactivity.create);
  router.get('/api/v1/applicants', controller.v1.applicants.index);
  router.post('/api/v1/applicants', controller.v1.applicants.create);
};
