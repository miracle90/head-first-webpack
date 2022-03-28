const mime = require("mime");
const path = require("path");

module.exports = function wrapper(context) {
  return function middleware(req, res, next) {
    let url = req.url;
    if (url === "/") {
      url = "/index.html";
    }
    let filename = path.join(context.outputPath, url);
    try {
      let stat = context.fs.statSync(filename);
      if (stat.isFile()) {
        let content = context.fs.readFileSync(filename);
        res.setHeader("Content-Type", mime.getType(filename));
        res.send(content);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(404);
    }
  };
};
