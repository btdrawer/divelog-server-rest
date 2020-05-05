const express = require("express");
const cookieParser = require("cookie-parser");
const { db, cache } = require("@btdrawer/divelog-server-utils");
const routerUrls = require("./constants/routerUrls");

const app = express();

db();
cache();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

for (let route in routerUrls) {
    const uri = routerUrls[route];
    app.use(uri, require(`./routes${uri}Routes`));
}

const port = process.env.SERVER_PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
