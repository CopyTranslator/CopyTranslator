class StringProcessor {
  readonly patterns: Array<RegExp> = [/([?!.])[ ]?\n/g, /([？！。])[ \n]/g];
  readonly pattern2 = /#([?？！!.。])#/g;
  constructor() {}

  static isChinese(src: string) {
    /*校验是否中文名称组成 */
    var reg = /^[\u4E00-\u9FA5]{2,4}$/; /*定义验证表达式*/
    return reg.test(src); /*进行验证*/
  }
  normalizeAppend(src: string) {
    src = src.replace("\r\n", "\n");
    src = src.replace("-\n", "");
    this.patterns.forEach(function(e) {
      src = src.replace(e, "#$1#");
    });
    src = src.replace("\n", " ");
    src = src.replace(this.pattern2, "$1\n");
    return src;
  }
}
export { StringProcessor };
