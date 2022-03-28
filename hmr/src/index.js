// import "../webpackHotDevClient";

let root = document.getElementById("root");
const title = require('./title')

function render() {
  console.log(title)
  root.innerHTML = title;
}
render();
