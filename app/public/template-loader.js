/**
 * loadTemplate
 * @param id
 * @param global
 * @param urlAppend
 * @param path
 * @return {Promise<void>}
 */
export async function loadTemplate(id, global, { urlAppend = '', path = '' } = {}) {
  const document = global.document;
  if (!document.getElementById(id)) {
    try {
      const html = await global.loadTwigComponent(path, urlAppend);
      const template = document.createElement('template');
      template.innerHTML = html;
      template.id = id;
      document.body.appendChild(template);
      return { html };
    } catch (e) {
      console.error(new Error(`loadTwigComponent ${path} failed`));
    }
  } else {
    const html = document.getElementById(id).innerHTML;
    return { html };
  }
}

