// let styles = require('!!css-loader?{"esModule":false}!./index.css'); // 行内loader，!!屏蔽webpack配置文件里面的配置
// console.log(styles);

// import "./index.css";
// import "./less.less";
// import "./scss.scss"; // scss是新版的sass后缀，语言都叫sass

// const img = require("../public/1.webp");

// let image = new Image()
// image.src = img
// document.body.appendChild(image)

// console.log(img)

// console.log("globalA", globalA);

/**
 *
 * @param {*} target 装饰的目标
 * @param {*} key 属性
 * @param {*} descriptor 属性描述器
 */
function readonly(target, key, descriptor) {
  descriptor.writable = false;
}

class Person {
  @readonly PI = 3.14;
}

let p = new Person();
p.PI = 3.15;

console.log(p)
