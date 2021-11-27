import GlobalsPlugin from 'esbuild-plugin-globals';
import esbuild from 'esbuild';

(async () => {
  // const vue3Plugin = s.vue3Plugin;

  /** Mapping from module paths to global variables */
  const globals = {
    vue: {
      type: 'esm',
      defaultExport: false,
    },
  };


  try {
    const res = await esbuild.build({
      // entryPoints: [ './fronts/main.js', './fronts/sds.js' ],
      entryPoints: [ './fronts/main.js', './fronts/ext.js', './fronts/weapp.js'  ],
      // outfile: './app/public/expose.js',
      splitting: true,
      outdir: './app/public/expose',
      format: 'esm',
      bundle: true,
      chunkNames: 'chunks/[name]-[hash]',
      external: [
        'vue',
      ],
      plugins: [
        // vue3Plugin(),
        GlobalsPlugin({
          /**
           * Simple string pattern
           * Any module matching "react" will be replaced with
           * `module.exports = React`
           */
          vue: "window.Vue",
        }),
      ],
      // write: false,
    });
    console.log(res);
  } finally {
  //
  }
})();
