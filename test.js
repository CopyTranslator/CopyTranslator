let t = false;
Promise.allSettled([
  new Promise(
    // resolver 函数在 Promise 成功或失败时都可能被调用
    (resolve, reject) => {
      console.log("???");
      return resolve("");
    }
  ).then(() => {
    console.log("dsdsd");
  }),
  new Promise(
    // resolver 函数在 Promise 成功或失败时都可能被调用
    (resolve, reject) => {
      console.log("111");
      return reject("");
    }
  ).then(() => {
    console.log("dsdsd");
  })
]).then(() => {
  console.log("!!!");
  t = true;
});
// while (!t);
