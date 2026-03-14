import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouter from './routes/products';
import locationRouter from './routes/locations';
import movementRouter from './routes/movements';
import ledgerRouter from './routes/ledger';
import purchaseOrderRouter from './routes/purchaseOrders';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRouter);
app.use('/api/locations', locationRouter);
app.use('/api/movements', movementRouter);
app.use('/api/ledger', ledgerRouter);
app.use('/api/purchase-orders', purchaseOrderRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
