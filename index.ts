import * as express from 'express';
import {router as v1} from "./v1/index";
import * as http from "http";
import {frontend, listenHost, listenPort, cookieSignatureSecret} from "./config";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieSignatureSecret));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.DEBUG ? '*' : frontend);
  next();
});

app.use('/v1', v1);

server.listen(listenPort, listenHost);
console.log(`Server listening on http://${listenHost}:${listenPort}`);

