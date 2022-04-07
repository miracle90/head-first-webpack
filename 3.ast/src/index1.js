import utils1 from "./module1";
import utils2 from "./module2";
import $ from "jquery";
console.log(utils1, utils2, $);
import(/* webpackChunkName: "asyncModule1" */ "./asyncModule1");
