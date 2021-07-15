import { camelNameToCls, Time } from './public/expose/main.js';

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
    emits: [
      'update:start',
      'update:end',
    ],
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
        // this.innerVal = [
        //   v[0] ? v[0] : '',
        //   v[1] ? v[1] : '',
        // ]
        console.dir(Time.formatDateTime);
        // this.$emit('update:start',
        //   Time.formatDateTime(v[0])
        // );
        // this.$emit('update:end',
        //   Time.formatDateTime(v[1])
        // );
        this.$emit('update:start',
          v[0]
        );
        this.$emit('update:end',
          v[1]
        );
      },
    },
  };
}
