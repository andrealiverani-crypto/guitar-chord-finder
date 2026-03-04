const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3456;
const DIR = __dirname;

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml"
};

http.createServer((req, res) => {
  let file = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(DIR, file);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[ext] || "text/plain" });
    res.end(data);
  });
}).listen(PORT, () => console.log("Serving on http://localhost:" + PORT));
