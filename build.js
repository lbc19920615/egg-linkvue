(async () => {
  const esbuild = require('esbuild');

  try {
    const res = await esbuild.buildSync({
      entryPoints: [ './fronts/main.js' ],
      // outfile: './app/public/expose.js',
      splitting: true,
      outdir: './app/public/expose',
      format: 'esm',
      bundle: true,
      // write: false,
    });
    console.log(res);
  } finally {
  //
  }
})();
