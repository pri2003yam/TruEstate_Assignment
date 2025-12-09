/**
 * Database Seeder Script
 * 
 * This script reads data from a CSV file and populates the MongoDB database.
 * Uses streaming batch inserts to handle large datasets (1M+ rows).
 * 
 * Usage: npm run seed
 * 
 * Make sure to:
 * 1. Place your truestate_assignment_dataset.csv file in the project root
 * 2. Configure your .env file with MONGODB_URI
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Transaction = require('./src/models/Transaction');

// CSV file path - the dataset is in the project root folder
const CSV_FILE_PATH = path.join(__dirname, '..', 'truestate_assignment_dataset.csv');

// Batch size for inserts (adjust based on memory)
const BATCH_SIZE = 5000;

// Maximum records to import (set to null for all records)
// Free tier MongoDB Atlas has 512MB limit (~500K records)
const MAX_RECORDS = 500000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Transform CSV row to schema format
const transformRow = (row) => ({
  // Transaction Info
  TransactionID: parseInt(row['Transaction ID'], 10),
  Date: row['Date'] ? new Date(row['Date']) : new Date(),
  
  // Customer Info
  CustomerID: row['Customer ID'],
  CustomerName: row['Customer Name'],
  PhoneNumber: row['Phone Number'],
  Gender: row['Gender'],
  Age: parseInt(row['Age'], 10) || null,
  CustomerRegion: row['Customer Region'],
  CustomerType: row['Customer Type'],
  
  // Product Info
  ProductID: row['Product ID'],
  ProductName: row['Product Name'],
  Brand: row['Brand'],
  ProductCategory: row['Product Category'],
  Tags: row['Tags'],
  
  // Order Info
  Quantity: parseInt(row['Quantity'], 10) || 0,
  PricePerUnit: parseFloat(row['Price per Unit']) || 0,
  DiscountPercentage: parseFloat(row['Discount Percentage']) || 0,
  TotalAmount: parseFloat(row['Total Amount']) || 0,
  FinalAmount: parseFloat(row['Final Amount']) || 0,
  
  // Payment & Delivery
  PaymentMethod: row['Payment Method'],
  OrderStatus: row['Order Status'],
  DeliveryType: row['Delivery Type'],
  
  // Store Info
  StoreID: row['Store ID'],
  StoreLocation: row['Store Location'],
  SalespersonID: row['Salesperson ID'],
  EmployeeName: row['Employee Name']
});

// Insert batch into database
const insertBatch = async (batch, batchNumber) => {
  try {
    await Transaction.insertMany(batch, { ordered: false, lean: true });
    console.log(`   ✓ Batch ${batchNumber}: Inserted ${batch.length} records`);
    return batch.length;
  } catch (error) {
    if (error.code === 11000) {
      const inserted = error.insertedDocs ? error.insertedDocs.length : 0;
      console.log(`   ⚠ Batch ${batchNumber}: ${inserted} inserted, some duplicates skipped`);
      return inserted;
    }
    throw error;
  }
};

// Stream CSV and insert in batches
const seedDatabase = async () => {
  // Check if file exists
  if (!fs.existsSync(CSV_FILE_PATH)) {
    throw new Error(`CSV file not found at: ${CSV_FILE_PATH}`);
  }

  let batchNumber = 0;
  let totalRows = 0;
  let totalInserted = 0;

  // Use a promise-based approach with proper async handling
  const rows = [];
  let limitReached = false;
  
  await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv());
    
    stream.on('data', (row) => {
      if (MAX_RECORDS && rows.length >= MAX_RECORDS) {
        if (!limitReached) {
          limitReached = true;
          stream.destroy();
        }
        return;
      }
      rows.push(transformRow(row));
    });
    
    stream.on('end', () => {
      console.log(`📄 Parsed ${rows.length} rows from CSV${MAX_RECORDS ? ` (limited to ${MAX_RECORDS})` : ''}\n`);
      resolve();
    });
    
    stream.on('close', () => {
      if (limitReached) {
        console.log(`📄 Parsed ${rows.length} rows from CSV (limited to ${MAX_RECORDS})\n`);
        resolve();
      }
    });
    
    stream.on('error', reject);
  });

  // Process in batches
  console.log('📥 Inserting data in batches...\n');
  
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batchNumber++;
    const currentBatch = rows.slice(i, i + BATCH_SIZE);
    const inserted = await insertBatch(currentBatch, batchNumber);
    totalInserted += inserted;
    totalRows += currentBatch.length;
    
    // Clear references to help garbage collection
    for (let j = i; j < Math.min(i + BATCH_SIZE, rows.length); j++) {
      rows[j] = null;
    }
  }

  console.log(`\n📊 Total rows processed: ${totalRows}`);
  console.log(`✅ Total records inserted: ${totalInserted}`);
  
  return totalInserted;
};

// Main function
const main = async () => {
  console.log('\n🌱 Starting Database Seeder...\n');
  console.log(`📦 Batch size: ${BATCH_SIZE} records per batch\n`);

  try {
    // Connect to database
    await connectDB();

    // Clear existing transactions
    console.log('🗑️  Clearing existing records...');
    const deleteResult = await Transaction.deleteMany({});
    console.log(`   Cleared ${deleteResult.deletedCount} existing records\n`);

    // Stream CSV and insert in batches
    console.log(`📂 Reading CSV from: ${CSV_FILE_PATH}\n`);
    
    await seedDatabase();

    console.log('\n🎉 Database seeding completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeder
main();
