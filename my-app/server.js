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
.then(() => console.log('MongoDBに接続しました'))
.catch(err => console.log('MongoDB接続エラー:', err));

// ログをファイルに書き込む関数
const logToFile = (data) => {
  const logFilePath = path.join(__dirname, 'logs.json');
  fs.readFile(logFilePath, 'utf8', (err, content) => {
    let logs = [];
    if (err && err.code !== 'ENOENT') {
      console.error('ログファイルの読み取りエラー', err);
      return;
    }
    if (!err) {
      try {
        logs = JSON.parse(content);
      } catch (parseError) {
        console.error('ログファイル内容の解析エラー', parseError);
      }
    }
    logs.push(data);
    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('ログファイルへの書き込みエラー', writeErr);
      } else {
        console.log('ログファイルに書き込みました');
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
  const shiftMonthYearString = `${shiftYear}-${shiftMonth.toString().padStart(2, '0')}`;

  try {
    console.log('受信データ:', req.body); // 受信データをログに出力

    // 既存のデータを削除
    const deleteResult = await Employee.deleteMany({
      name,
      role,
      $or: [
        { 'availability.date': { $regex: `^${shiftMonthYearString}` } },
        { 'unavailableDates': { $regex: `^${shiftMonthYearString}` } }
      ]
    });

    // 日付を文字列に変換して保存
    const newEmployee = {
      name,
      role,
      availability: availability.map(a => ({ ...a, date: new Date(a.date).toISOString() })),
      unavailableDates: unavailableDates.map(date => new Date(date).toISOString())
    };

    const employee = new Employee(newEmployee);
    await employee.save();

    // 変更があった場合のみログを保存
    if (deleteResult.deletedCount > 0) {
      logToFile(req.body); // 受信データをログファイルに保存
      console.log('従業員データを更新しました'); // データ更新成功のログ
    } else {
      console.log('更新対象のレコードが見つかりませんでした');
    }

    res.status(201).send('従業員データを保存しました');
  } catch (error) {
    console.error('従業員データの保存エラー:', error); // エラーログ
    logToFile({ error: error.message }); // エラーをログファイルに保存
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`サーバーはポート${PORT}で稼働中です`);
});
