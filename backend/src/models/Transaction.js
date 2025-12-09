const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Info
  TransactionID: { type: Number, required: true, unique: true },
  Date: { type: Date, required: true },
  
  // Customer Info
  CustomerID: { type: String, required: true },
  CustomerName: { type: String, required: true },
  PhoneNumber: { type: String },
  Gender: { type: String },
  Age: { type: Number },
  CustomerRegion: { type: String, required: true },
  CustomerType: { type: String },
  
  // Product Info
  ProductID: { type: String, required: true },
  ProductName: { type: String, required: true },
  Brand: { type: String },
  ProductCategory: { type: String, required: true },
  Tags: { type: String },
  
  // Order Info
  Quantity: { type: Number, required: true },
  PricePerUnit: { type: Number, required: true },
  DiscountPercentage: { type: Number },
  TotalAmount: { type: Number, required: true },
  FinalAmount: { type: Number, required: true },
  
  // Payment & Delivery
  PaymentMethod: { type: String, required: true },
  OrderStatus: { type: String, required: true },
  DeliveryType: { type: String },
  
  // Store Info
  StoreID: { type: String },
  StoreLocation: { type: String },
  SalespersonID: { type: String },
  EmployeeName: { type: String }
}, {
  strict: false,
  timestamps: false
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
