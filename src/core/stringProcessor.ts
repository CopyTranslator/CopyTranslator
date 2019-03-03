const patterns: Array<RegExp> = [/([?!.])[ ]?\n/g, /([？！。])[ \n]/g]; //The first one is English like, the second is for Chinese like.
const pattern2 = /#([?？！!.。])#/g;

function isChinese(src: string) {
  /*校验是否中文名称组成 */
  var reg = /^[\u4E00-\u9FA5]{2,4}$/; /*定义验证表达式*/
  return reg.test(src); /*进行验证*/
}

function normalizeAppend(src: string) {
  src = src.replace(/\r\n/g, "\n");
  src = src.replace(/\r/g, "\n");
  src = src.replace(/-\n/g, "");
  patterns.forEach(function(e) {
    src = src.replace(e, "#$1#");
  });
  src = src.replace(/\n/g, " ");
  src = src.replace(pattern2, "$1\n");
  return src;
}

export { isChinese, normalizeAppend };
