// read file nodejs?
var fs = require("fs"),
  path = require("path"),
  headerPath = path.join(__dirname, "conf/header.conf"),
  outputPath = path.join(__dirname, "output/nginx.conf");

try {
  fs.lstatSync(path.join(__dirname, "output"));
} catch (e) {
  console.log(e);
  fs.mkdirSync(path.join(__dirname, "output"));
}
fs.readFile(headerPath, { encoding: "utf-8" }, function (err, data) {
  if (!err) {
    try {
      fs.writeFileSync(outputPath, data);

      for (let port = 3000; port <= 3050; port++) {
        fs.appendFileSync(
          outputPath,
          `\n\tupstream port-${port} {\n\t\tserver localhost:${port};\n\t}\n\n`,
          "utf-8"
        );
        fs.appendFileSync(
          outputPath,
          `\tserver {\n\t\tlisten ${
            port + 1000
          }  ssl;\n\t\tssl_certificate_key /etc/letsencrypt/live/vmi723151.contaboserver.net/privkey.pem;\n\t\tssl_certificate     /etc/letsencrypt/live/vmi723151.contaboserver.net/fullchain.pem;\n\n\t\tlocation / {\n\t\t\tproxy_pass http://port-${port};\n\t\t\t#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\t\t\t#         proxy_set_header X-Real-IP $remote_addr;\n\t\t\t#         proxy_set_header Host $host;\n\t\t\tproxy_http_version 1.1;\n\t\t\tproxy_set_header Upgrade $http_upgrade;\n\t\t\tproxy_set_header Connection "Upgrade";\n\t\t}\n\t}\n`,
          "utf-8"
        );
      }
      fs.appendFileSync(outputPath, `}`, "utf-8");
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(err);
  }
});
