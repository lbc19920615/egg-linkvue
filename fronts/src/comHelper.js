import get from 'lodash/get';

// function findPathsToKey(options) {
//   const results = [];
//
//   (function findKey({
//     key,
//     obj,
//     pathToKey,
//   }) {
//     const oldPath = `${pathToKey ? pathToKey + '.' : ''}`;
//     if (typeof obj === 'object' && obj.hasOwnProperty(key)) {
//       results.push(`${oldPath}${key}`);
//       // return;
//     }
//
//     if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
//       for (const k in obj) {
//         if (obj.hasOwnProperty(k)) {
//           if (Array.isArray(obj[k])) {
//             for (let j = 0; j < obj[k].length; j++) {
//               findKey({
//                 obj: obj[k][j],
//                 key,
//                 pathToKey: `${oldPath}${k}[${j}]`,
//               });
//             }
//           } else if (obj[k] !== null && typeof obj[k] === 'object') {
//             findKey({
//               key,
//               pathToKey: `${oldPath}${k}`,
//             });
//           } else {
//           //
//           }
//         }
//       }
//     }
//   })(options);
//
//   return results;
// }

function findPathsToKey(options) {
  const results = [];

  (function findKey({
    key,
    obj,
    pathToKey,
  }) {
    const oldPath = `${pathToKey ? pathToKey + '.' : ''}`;
    if (typeof obj === 'object' && obj.hasOwnProperty(key)) {
      results.push(`${oldPath}${key}`);
      // return;
    }

    if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
          if (Array.isArray(obj[k])) {
            for (let j = 0; j < obj[k].length; j++) {
              findKey({
                obj: obj[k][j],
                key,
                pathToKey: `${oldPath}${k}[${j}]`,
              });
            }
          } else if (obj[k] !== null && typeof obj[k] === 'object') {
            findKey({
              obj: obj[k],
              key,
              pathToKey: `${oldPath}${k}`,
            });
          } else {
            //
          }
        }
      }
    }
  })(options);

  return results;
}

// let ret = findPathsToKey( {
//
//   obj: {
//     ui: {
//       widget: ''
//     }
//   },
//   key: 'widget'
// })
//
// console.log(ret)

/**
 * 自动赋值
 * @param obj
 * @param key
 * @param base
 * @param computedVal
 */
function autoVal({ obj, key, base, computedVal = function() {} } = {}) {
  const paths = findPathsToKey({ obj, key });
  // console.log(obj, key, paths);

  for (let k = 0; k < paths.length; k++) {
    let target;
    let p = paths[k].replace(key, '');
    if (p.endsWith('.')) {
      p = p.slice(0, -1);
    }
    if (p.trim() === '') {
      target = base;
    } else {
      target = get(base, p);
    }
    target[key] = computedVal();
  }
}

export default {
  autoVal,
};
