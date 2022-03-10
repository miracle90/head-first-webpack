let module2 = {
  exports2: { name: 1 },
};

let exports2 = module2.exports2;

exports2 = { name: 2 };

console.log(module2);
