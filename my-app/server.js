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
mongoose.connect('mongodb://localhost:27017/shift-scheduler')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// ログをファイルに書き込む関数
const logToFile = (data) => {
  const logFilePath = path.join(__dirname, 'logs.json');
  fs.readFile(logFilePath, 'utf8', (err, content) => {
    let logs = [];
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading log file', err);
      return;
    }
    if (!err) {
      try {
        logs = JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing log file content', parseError);
      }
    }
    logs.push(data);
    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing to log file', writeErr);
      } else {
        console.log('Log written to file');
      }
    });
  });
};

// シフト提出エンドポイント
app.post('/api/employees', async (req, res) => {
  const { name, role, availability, unavailableDates } = req.body;

  // シフトの月と年を計算
  const shiftMonth = availability.length > 0 
    ? new Date(availability[0].date).getMonth() + 1
    : new Date(unavailableDates[0]).getMonth() + 1;
  const shiftYear = availability.length > 0 
    ? new Date(availability[0].date).getFullYear()
    : new Date(unavailableDates[0]).getFullYear();

  try {
    console.log('Received data:', req.body); // 受信データをログに出力
    logToFile(req.body); // 受信データをログファイルに保存

    // 日付を文字列に変換して保存
    const newEmployee = {
      name,
      role,
      availability: availability.map(a => ({ ...a, date: new Date(a.date).toISOString() })),
      unavailableDates: unavailableDates.map(date => new Date(date).toISOString())
    };

    // 既存のシフトを検索して更新、なければ挿入
    const result = await Employee.updateOne(
      { 
        name, 
        role, 
        'availability.date': { 
          $regex: `^${shiftYear}-${shiftMonth.toString().padStart(2, '0')}` 
        } 
      },
      { $set: newEmployee },
      { upsert: true }
    );

    if (result.nModified > 0 || result.upserted) {
      console.log('Employee data updated successfully'); // データ更新成功のログ
    } else {
      console.log('Employee data inserted successfully'); // データ挿入成功のログ
    }

    res.status(201).send('Employee data saved successfully');
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
