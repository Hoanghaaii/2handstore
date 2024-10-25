import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const config = {
  appid: process.env.APPID,
  key1: process.env.KEY1,
  key2: process.env.KEY2,
  endpoint: process.env.ENDPOINT,
};

export const createPayment = async (req, res) => {
  const embeddata = {
    merchantinfo: "embeddata123",
    redirecturl: "https://docs.zalopay.vn/result",
  };

  const items = [
    {
      itemid: "knb",
      itemname: "kim nguyen bao",
      itemprice: 198400,
      itemquantity: 1,
    },
  ];

  const order = {
    appid: config.appid,
    apptransid: `${moment().format('YYMMDD')}_${uuidv4()}`,
    appuser: "demo",
    apptime: Date.now(),
    item: JSON.stringify(items),
    embeddata: JSON.stringify(embeddata),
    amount: 50000,
    description: "ZaloPay Integration Demo",
    bankcode: "",
    callbackurl: "https://ad8b-113-185-54-154.ngrok-free.app/api/zalopay/callback"
  };

  const data =
    config.appid +
    "|" +
    order.apptransid +
    "|" +
    order.appuser +
    "|" +
    order.amount +
    "|" +
    order.apptime +
    "|" +
    order.embeddata +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result.data);
    res.json(result.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Payment creation failed", message: error.message });
  }
};

export const callBack = async (req, res) => {
  let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    if (reqMac !== mac) {
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr);
      console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0;
    result.returnmessage = ex.message;
  }

  res.json(result);
};
