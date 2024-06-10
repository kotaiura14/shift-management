const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Employee = require('./models/Employee'); // スキーマファイルをインポート

const app = express();
app.use(express.json()); // JSONパース用ミドルウェア
app.use(cors()); // CORSを有効にする

// MongoDBに接続
mongoose.connect('mongodb://localhost:27017/shift-scheduler');

app.post('/api/employees', async (req, res) => {
  try {
    console.log('Received data:', req.body); // 受信データをログに出力
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    console.log('Employee data saved successfully'); // データ保存成功のログ
    res.status(201).send(newEmployee);
  } catch (error) {
    console.error('Error saving employee data:', error); // エラーログ
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
