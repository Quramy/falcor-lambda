import dataSourceHanlder from "falcor-lambda";
import MyRouter from "./router";

module.exports.handler = dataSourceHanlder(() => new MyRouter(), {debug: true});
