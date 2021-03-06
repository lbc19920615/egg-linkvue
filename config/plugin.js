/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // mysql: {
  //   enable: true,
  //   package: 'egg-mysql',
  // },
  sequelize: {
    enable: false,
    package: 'egg-sequelize',
  },
  twig: {
    enable: true,
    package: 'egg-view-twig',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
};
