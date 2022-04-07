## loader

* 所谓 loader 只是一个导出为函数的 JavaScript 模块。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain
* compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）

## loader-runner

loader-runner是一个执行 loader 链条的的模块

## loader 类型

loader 的叠加顺序 = post(后置)+inline(内联)+normal(正常)+pre(前置)
