import {parseBoolean} from "../util/request-utils";

console.log(parseBoolean(true));
console.log(parseBoolean(false));
console.log(parseBoolean(null));
console.log(parseBoolean(null, true));
console.log(parseBoolean(undefined));
console.log(parseBoolean(undefined, true));
console.log(parseBoolean(''));
console.log(parseBoolean('yes'));
console.log(parseBoolean('no'));
console.log(parseBoolean('no', true));
console.log(parseBoolean(200));
console.log(parseBoolean('true'));
console.log(parseBoolean('true', true));
console.log(parseBoolean('false'));
console.log(parseBoolean('false', true));
