const requireJSON5 = require('require-json5');
const path = require('path');
const fs = require('fs');

const configFolder = 'app/config';
const appFolder = 'app';

module.exports = {
  /**
   * loadConfig
   * @param p {string}
   * @return {*}
   */
  loadConfig(p) {
    const url = path.join(this.app.baseDir, configFolder, p);
    return requireJSON5(url);
  },
  /**
   * loadFile
   * @param p {string}
   * @return {string}
   */
  loadFile(p) {
    const url = path.join(this.app.baseDir, appFolder, p);
    return fs.readFileSync(url).toString();
  },
};
