const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Employee = require('./models/Employee'); // スキーマファイルをインポート

const app = express();
app.use(express.json()); // JSONパース用ミドルウェア
app.use(cors()); // CORSを有効にする

// MongoDBに接続
mongoose.connect('mongodb://localhost:27017/shift-scheduler');

// ログをファイルに書き込む関数
const logToFile = (data) => {
  const logFilePath = path.join(__dirname, 'logs.json');
  fs.readFile(logFilePath, (err, content) => {
    let logs = [];
    if (!err) {
      logs = JSON.parse(content);
    }
    logs.push(data);
    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
      if (err) {
        console.error('Error writing to log file', err);
      } else {
        console.log('Log written to file');
      }
    });
  });
};

app.post('/api/employees', async (req, res) => {
  try {
    console.log('Received data:', req.body); // 受信データをログに出力
    logToFile(req.body); // 受信データをログファイルに保存
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    console.log('Employee data saved successfully'); // データ保存成功のログ
    res.status(201).send(newEmployee);
  } catch (error) {
    console.error('Error saving employee data:', error); // エラーログ
    logToFile({ error: error.message }); // エラーをログファイルに保存
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
