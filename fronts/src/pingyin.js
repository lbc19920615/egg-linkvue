
export function initDict() {
  const dict = globalThis.pinyinUtil.dict;
  if (!dict.py2hz) throw '未找到合适的字典文件！';
  // 这一步仅仅是给字母a-z扩充，例如根据b找不到相关汉字，就把bi的结果赋值给b
  // 当然这种方式只是很简单的实现，真正的拼音输入法肯定不能这么简单处理
  dict.py2hz2 = {};
  dict.py2hz2.i = 'i'; // i比较特殊，没有符合的汉字，所以特殊处理
  for (let i = 97; i <= 123; i++) {
    const ch = String.fromCharCode(i);
    if (!dict.py2hz[ch]) {
      for (const j in dict.py2hz) {
        if (j.indexOf(ch) === 0) {
          dict.py2hz2[ch] = dict.py2hz[j];
          break;
        }
      }
    }
  }
}

// globalThis.Pinyin = Pinyin
export const getSingleHanzi = function(pinyin) {
  return globalThis.pinyinUtil.dict.py2hz2[pinyin] || globalThis.pinyinUtil.dict.py2hz[pinyin] || '';
};

/**
 * 拼音转汉字
 * @param pinyin 需要转换的拼音，如 zhongguo
 * @return 返回一个数组，格式类似：[["中","重","种","众","终","钟","忠"], "zhong'guo"]
 */
export const _getHanzi = function(pinyin) {
  // 因为最长可能是5个字母，如 zhuang
  const MAGIC_LENGTH = 5;
  let result = getSingleHanzi(pinyin);
  if (result) {
    // console.log(pinyin)
    return [ result.split(''), pinyin ];
  }
  let temp = '';
  for (let i = 0, len = pinyin.length; i < len; i++) {
    temp += pinyin[i];
    result = getSingleHanzi(temp);
    if (!result) continue;
    // flag表示如果当前能匹配到结果、并且往后5个字母不能匹配结果，因为最长可能是5个字母，如 zhuang
    let flag = false;
    if ((i + 1) < pinyin.length) {
      for (let j = 1, len = pinyin.length; j <= MAGIC_LENGTH && (i + j) < len; j++) {
        if (
          getSingleHanzi(
            pinyin.substr(0, i + j + 1)
          )
        ) {
          flag = true;
          break;
        }
      }
    }
    if (!flag) {
      return [
        result.split(''),
        pinyin.substr(0, i + 1),
        pinyin.substr(i + 1),

      ];
    }
  }
  return [[], '' ]; // 理论上一般不会出现这种情况
};


export const parsePingYing = function(pinyin = '', res = []) {
  const ret = _getHanzi(pinyin);
  if (Array.isArray(ret)) {
    if (ret.length === 2) {
      res.push(ret);
    }
    if (ret.length === 3) {
      res.push([ ret[0], ret[1] ]);
      parsePingYing(ret[2], res);
    }
  }
};

export const getHanzi = function(pingyin = '') {
  const ret = [];
  parsePingYing(pingyin, ret);
  return ret;
};
