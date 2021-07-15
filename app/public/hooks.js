import { camelNameToCls } from './expose/main.js';


/**
 * useCommonComponent
 * @param name { string }
 * @return {{customClass: *}}
 */
export function useCommonComponent({ name = '' } = {}) {
  // const { ref } = global.Vue;
  const customClass = camelNameToCls(name);
  return {
    customClass,
  };
}
