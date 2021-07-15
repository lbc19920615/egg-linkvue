(async () => {
  const esbuild = require('esbuild');
  const vue3Plugin = require('esbuild-plugin-vue-iii').vue3Plugin;

  try {
    const res = await esbuild.build({
      // entryPoints: [ './fronts/main.js', './fronts/sds.js' ],
      entryPoints: [ './fronts/main.js' ],
      // outfile: './app/public/expose.js',
      splitting: true,
      outdir: './app/public/expose',
      format: 'esm',
      bundle: true,
      chunkNames: 'chunks/[name]-[hash]',
      plugins: [
        vue3Plugin(),
      ],
      // write: false,
    });
    console.log(res);
  } finally {
  //
  }
})();
