/*
 * Copyright (c) 2020 The Web eID Project
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const path         = require("path");
const express      = require("express");
const cookieParser = require("cookie-parser");
const logger       = require("morgan");
const helmet       = require("helmet");
const session      = require("express-session");

const IndexController = require("./controllers/RootController");
const AuthController  = require("./controllers/AuthController");
const SignController  = require("./controllers/SignController");

const controllers = [
  new IndexController(),
  new AuthController(),
  new SignController(),
];

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const oneDay = 1000 * 60 * 60 * 24;

app.set("trust proxy", 1) // trust first proxy

app.use("*", session({
  name:              "session",
  secret:            "secret",
  resave:            false,
  saveUninitialized: true,

  cookie: {
    sameSite: "none", // Needed for CORS
    secure:   true,
    httpOnly: true,
    maxAge:   oneDay,
  },
}))

if (!process.argv.slice(2).includes("--no-csp")) {
  app.use(helmet.contentSecurityPolicy());
}
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/lib", express.static(path.join(__dirname, "../node_modules/@web-eid/web-eid-library/dist/")));

app.get("/", (req, res) => res.render("index", {
  tokenSigning: req.query.tokenSigning == "true",
}));

app.get("/webeid", (req, res) => res.render("webeid", {
  tokenSigning: req.query.tokenSigning == "true",
}));

app.get("/hwcrypto", (req, res) => res.render("hwcrypto", {
  tokenSigning: req.query.tokenSigning == "true",
}));

controllers.forEach((controller) => app.use("/", controller.router));

module.exports = app;
