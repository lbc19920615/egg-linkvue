import { camelNameToCls } from './public/expose/main.js';

export default function(name) {
  const templateId = name + '-tpl';
  // eslint-disable-next-line no-undef
  globalThis.initTemplate(templateId, globalThis, {
    html: `{{html}}`,
  });

  return {
    name,
    template: '#' + templateId,
    props: {
      start: '',
      end: '',
    },
    data() {
      return {
        customClass: camelNameToCls(name),
        innerVal: [
          this.start ? this.start : '',
          this.end ? this.end : '',
        ],
      };
    },
    methods: {
      onChange(v) {
        // console.log('onChange', v)
        // this.$emit('change', v)
        this.$emit('update:start', v[0]);
        this.$emit('update:end', v[1]);
      },
    },
  };
}
