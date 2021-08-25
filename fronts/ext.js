import _eval5, { Interpreter } from 'eval5';

/**
 * eval5
 * @type {(code: string, ctx?: (VMContext | undefined), options?: (ScriptOptions | undefined)) => any}
 */
export const eval5 = _eval5;


/**
 * evaluate
 * @param codes {[string]}
 * @param ctx
 */
// eslint-disable-next-line no-undef
export function run(codes = [], ctx = globalThis) {
  const interpreter = new Interpreter(ctx, {
    timeout: 1000,
  });

  let result;

  try {
    codes.forEach(code => {
      result = interpreter.evaluate(code);
    });
    // interpreter.evaluate("var a=100");
    // interpreter.evaluate("var b=200");
    // result = interpreter.evaluate("a+b");

    console.log(result);
  } catch (e) {
    console.log(e);
  }
}
