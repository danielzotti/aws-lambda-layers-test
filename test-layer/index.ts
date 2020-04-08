import * as serverless from 'serverless-http';
import * as Express from 'express';
import * as cors from 'cors';
import * as bodyParser from "body-parser";
import moment = require("moment");

const app: Express.Application = Express();

app.use(cors());

app.use(bodyParser.json());

app.get(`/test`, async (req, res) => {

    try {

      const result = {
        message: `Hello! Time is ${moment().format('HH:mm:ss')}`
      }

      res.send(result);

    } catch (err) {
      res.send({
        message: err.message
      });
    }

  }
)
;

module.exports.handler = serverless(app);
