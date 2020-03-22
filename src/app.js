const express = require("express");
const cookieParser = require("cookie-parser");
const routerUrls = require("./variables/routerUrls");

const app = express();

require("./db");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

for (let route in routerUrls) {
    const uri = routerUrls[route];
    app.use(uri, require(`./routes${uri}`));
}

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
