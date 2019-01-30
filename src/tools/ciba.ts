// import axios from "axios";

// class CibaDict {
//   constructor() {}
//   async query(expression: string) {
//     // Make a request for a user with a given ID
//     try {
//       let res = await axios.get(
//         `http://open.iciba.com/huaci_v3/dict.php?word=${expression}`
//       );
//       console.log(res.data);
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   /**金山词霸排版*/
//   static parseIciba(rst: string): any {
//     try {
//       rst = rst
//         .replace(/class=\\"icIBahyI-prons\\"/g, "__mystyle__") // 音标
//         .replace(/\\"/g, '"') // 引号
//         // A标签
//         .replace(/<a([^>]*)?>详细释义<\/a([^>]*)?>/g, "")
//         .replace(/<a([^>]*)?>/g, "")
//         .replace(/<\/a([^>]*)?>/g, "")
//         // 清理属性、标签、多余空格
//         .replace(/(?:class|id|style|xml:lang|lang)="([^"]*)"/g, "")
//         .replace(/(?:label>|strong>)/g, "span>")
//         .replace(/(?:<label|<strong)/g, "<span")
//         .replace(/(?:p>)/g, "div>")
//         .replace(/[ ]+/g, " ")
//         // 音标
//         .replace(/__mystyle__/g, ' style="color:#777;"');
//       var match = /dict.innerHTML='(.*)?';/g.exec(rst);
//       return (<any>match)[1];
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
//   }
// }

// export { CibaDict };
