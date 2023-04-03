require("dotenv").config();
const logger = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// import routers
const productRouter = require("./routes/productRouter");
const sellerRouter = require("./routes/sellerRouter");
const tokenRouter = require("./routes/tokenRouter");

// import helper functions
const {authenticateToken} = require("./helper/index");
const CrawlerService = require("./scrape/service");

// instantiate an express server
const app = express();

// add middleware for logging and parsing incoming data
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json({limit: "50mb"}));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 5000,
  })
);

// define the base URL
const baseUrl = process.env.BASE_URL;

// register routes
app.use(baseUrl + "/token", tokenRouter);
app.use(baseUrl, authenticateToken);
app.use(baseUrl + "/seller", sellerRouter);
app.use(baseUrl + "/product", productRouter);

// for puppeteer test
app.use("/test", async (req, res) => {
  const serv = new CrawlerService();
  const a = await serv.test();
  res.send(a);
})

// define a basic fallback route
app.use("/", (req, res) => {
  res.send("Hello, this is api for tackle net");
});


// export the app module
module.exports = app;
