function factory(Object) {


  const default_options = {
    strict: true,
    order: true,
    caseSensitive: true,
  };

  /**
   * @param {object} obj1
   * @param {object} obj2
   * @param {object} [options]
   * @param {boolean} [options.strict] If true, all values must have strict equality
   * @param {boolean} [options.order] If true, all array elements must be in the same order
   * @param {boolean} [options.caseSensitive] If false, strings are compared case-insensitively
   * @return boolean
   */
  function compare(obj1, obj2, options) {

    options = options === undefined || typeof options !== 'object' || Array.isArray(options)
      ? default_options
      : Object.assign(JSON.parse(JSON.stringify(default_options)), options);

    if (typeof obj1 !== typeof obj2) {
      if (!options.strict
        && (typeof obj1 === 'number' || typeof obj1 === 'string')
        && (typeof obj2 === 'number' || typeof obj2 === 'string')) {
        return obj1 == obj2;
      }
      return false;

    }
    switch (typeof obj1) {
      case 'object':
        if (Array.isArray(obj1) || Array.isArray(obj2)) {
          if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) {
              return false;
            } else if (options.order) {
              return obj1.every(function(element, index) {
                return compare(element, obj2[index], options);
              });
            }
            return obj1.every(function(element) {
              return obj2.some(function(element2) {
                return compare(element, element2, options);
              });
            });

          }
          return false;

        }
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
          return false;
        }
        return Object.keys(obj1).every(function(key) {
          return key in obj2 && compare(obj1[key], obj2[key], options);
        });

        // eslint-disable-next-line no-unreachable
        break;
      case 'string':
        return options.caseSensitive ? obj1 === obj2 : obj1.toLocaleLowerCase() === obj2.toLocaleLowerCase();
      default:
        return obj1 === obj2;
    }

  }

  return compare;

}

export default factory;
