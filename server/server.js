const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// جعل مجلد الصور المرفوعة متاحاً للمتصفح
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.send('Alzikrayat REST API is running...');
});

// الاتصال بقاعدة بيانات MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alzikrayat_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});