// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const dbURI = 'mongodb+srv://Elawdy:236120111Nour@elawdy.c5mpz8e.mongodb.net/alawadhi_trade?retryWrites=true&w=majority&appName=Elawdy';

mongoose.connect(dbURI)
  .then(() => console.log('☁️ تم الاتصال بقاعدة البيانات السحابية بنجاح!'))
  .catch(err => console.log('❌ خطأ في الاتصال بقاعدة البيانات:', err));

const orderSchema = new mongoose.Schema({
    clientName: String,
    phone: String,
    productType: String,
    details: String,
    status: { type: String, default: 'قيد المراجعة' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 1. استقبال الطلبات
app.post('/api/submit-order', async (req, res) => {
    try {
        const { clientName, phone, productType, details } = req.body;
        const newOrder = new Order({ clientName, phone, productType, details });
        await newOrder.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// 2. جلب الطلبات
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); 
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// 3. 🌟 مسار جديد: تحديث حالة الطلب
app.put('/api/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.status(200).json({ success: true, message: 'تم تحديث الحالة بنجاح!' });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// 4. 🌟 مسار جديد: حذف طلب
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'تم حذف الطلب بنجاح!' });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ الخادم المطور يعمل الآن على المنفذ ${PORT}`);
});
