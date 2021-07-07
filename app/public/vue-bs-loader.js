var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

const _global = getGlobal()
_global.global = _global
global.ssrComponents = new Map()

/**
 * loadTwigComponent
 * @param pathWithOutExt {string}
 * @param urlAppend {string}
 * @returns {Promise<unknown>}
 */
global.loadTwigComponent = function(pathWithOutExt = '', urlAppend = '') {
  let url = `/getscript?src=${pathWithOutExt}.twig${urlAppend}`
  let key = pathWithOutExt + '.vue'
  return new Promise(resolve => {
    import(url).then(res => {
      let content =  res.default
      resolve(content)
    })
  })
}

// window.loadTwigComponent('formbuild', '&config_id=').then((res) => {
//   console.log('loadTwigComponent', res)
// })

let ModuleConfig = (function() {

  const configMap = new Map()
  return {
    global: {
      setConfig(data = {}) {
        if (!data.id) {
          console.error('need id')
        }
        configMap.set(data.id, data)
      }
    },
    createStore() {
      return {
        install(app) {
          console.log(app)
          app.config.globalProperties.$alConfig = {
            get(id) {
              if (configMap.has(id)) {
                return configMap.get(id)
              }
            }
          }
        }
      }
    }
  }
})()


export const moduleConfig = ModuleConfig.createStore()

const options = {

  moduleCache: {
    vue: Vue,
  },

  async getFile(url) {
    let { urlAppend = ''} = options.customConfig ? options.customConfig : {}
    delete options.customConfig
    const urlObj = new URL('http://' + url)
    const p = urlObj.hostname.split('.').slice(0, -1).join('.')
    const key = p + '.twig'
    if (global.ssrComponents.has(key)) {
      return Promise.resolve(global.ssrComponents.get(key))
    }
    // if (url.endsWith('twig')) {
    //   const p = url.split('.').slice(0, -1).join('.')
    //   return window.loadTwigComponent(p)
    // }
    // return window.loadTwigComponent(url)
    return global.loadTwigComponent(p, urlAppend)
    // return window.fetch(`/getscript?src=${url}`).then(response => {
    //   return response.ok ? response.text() : Promise.reject(response)
    // });
  },

  addStyle(styleStr) {
    const style = document.createElement('style');
    style.textContent = styleStr;
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },

  customBlockHandler(block, filename, options) {

    if ( block.type !== 'config' )
      return

    const messages = JSON.parse(block.content);
    // console.log(messages, filename, options)
    ModuleConfig.global.setConfig(messages)
  },

  log(type, ...args) {
    console.log(type, ...args);
  }
}

const { loadModule, version } = global["vue3-sfc-loader"];

global.loadComponent = (path, urlAppend) => {
  options.customConfig = {
    urlAppend
  }
  return Vue.defineAsyncComponent(() => loadModule(path, options))
}
