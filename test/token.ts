import {Token} from "../model/token";

async function test() {
  console.log(JSON.stringify(await Token.obtainEmail()));
  console.log(JSON.stringify(await Token.obtainMobile()));
}

test();
