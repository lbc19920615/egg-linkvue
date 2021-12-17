
// import './init2.js';

import * as ZY from './expose/main.js';
// eslint-disable-next-line no-undef
globalThis.ZY = ZY;

import * as ZY_EXT from './expose/ext.js';
// eslint-disable-next-line no-undef
globalThis.ZY_EXT = ZY_EXT;


// eslint-disable-next-line no-undef
if (globalThis.onLib2Ready) {
  // eslint-disable-next-line no-undef
  globalThis.onLib2Ready();
}
