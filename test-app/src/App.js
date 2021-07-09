import React, { Component } from "react";
import BarStack from "./BarStack";
import BarChart from "./Bar"

import MadeData from "./Data"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";

const str = "hello";
const obj = {[`${str}`]: str}
console.log(obj[`${str}`])

function App() {
  return <BarStack data={MadeData} />;
}
export default App;
