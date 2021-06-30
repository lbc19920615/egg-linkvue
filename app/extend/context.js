const requireJSON5 = require('require-json5');
const path = require('path');

const configFolder = 'app/config';

module.exports = {
  /**
   * loadConfig
   * @param p
   * @returns {*}
   */
  loadConfig(p) {
    const url = path.join(this.app.baseDir, configFolder, p);
    return requireJSON5(url);
  },
};
