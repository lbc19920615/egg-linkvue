import _eval5, { Interpreter } from 'eval5';

/**
 * eval5
 * @type {(code: string, ctx?: (VMContext | undefined), options?: (ScriptOptions | undefined)) => any}
 */
export const eval5 = _eval5;


/**
 * evaluate
 * @param code {string}
 * @param ctx
 */
// eslint-disable-next-line no-undef
export function run(code = '', ctx = {}) {
  return eval5(`
function __main() {
${code}
}
__main();
`, ctx ? ctx : {});
}
