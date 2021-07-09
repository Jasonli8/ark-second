import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import MadeData from './Data.js'



let data = MadeData;
console.log(data);
const temp = data.map((d) => {
  return `${d.date}`;
});
console.log(temp);
console.log(schemeCategory10);
const temp2 = scaleOrdinal(schemeCategory10);
console.log(temp2);

const f = scaleOrdinal(schemeCategory10).domain(temp);

const fill = (d, i) => {
  return f(i);
};
