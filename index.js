const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PAYEER_SECRET = process.env.PAYEER_SECRET; // Установим в Railway
const SUCCESS_HANDLER = (data) => {
  console.log("✅ Платёж подтверждён:", data);
  // Здесь можно запускать покупку алмазов
};

app.post('/payeer-webhook', (req, res) => {
  const data = req.body;

  const hashStr = `${data.m_shop}:${data.m_orderid}:${data.m_amount}:${data.m_curr}:${data.m_desc}:${data.m_status}:${PAYEER_SECRET}`;
  const sign = crypto.createHash('sha256').update(hashStr).digest('hex').toUpperCase();

  if (data.m_sign === sign && data.m_status === 'success') {
    SUCCESS_HANDLER(data);
    res.send('OK');
  } else {
    res.status(400).send('Invalid');
  }
});

app.get('/', (req, res) => {
  res.send("Backend работает ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});