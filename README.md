# TruEstate Assignment

A full-stack MERN application for managing and visualizing transaction data with advanced multi-select filtering, fuzzy search, sorting, and pagination capabilities.

---

## 📋 Overview

This project is a **Transaction Management Dashboard** built as part of a coding assignment. It demonstrates a complete data pipeline from CSV import to a fully interactive web interface with 500,000+ transaction records.

### Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Select Filtering** | Filter by Region, Category, Status, Payment Method, Gender, Age Range, Tags, Date Range |
| **Fuzzy Search** | Search by Customer Name, Product Name, or Transaction ID with regex matching |
| **Smart Sorting** | Click column headers or use dropdown to sort by any field (asc/desc) |
| **Pagination** | Navigate with First/Prev/Next/Last buttons and numbered pages |
| **Real-time Summary** | Aggregated totals (Units, Amount, Discount) from ALL matching records |
| **Dark Sidebar** | Professional dashboard UI with pink accent theme |
| **Date Range Picker** | Filter transactions by custom date range |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI framework |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **HTTP Client** | Axios | API communication |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB Atlas | Cloud NoSQL database (500K records) |
| **ODM** | Mongoose | Schema validation & queries |
| **Data Import** | csv-parser | CSV to MongoDB batch seeding |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account ([Create free cluster](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/pri2003yam/TruEstate_Assignment.git
cd TruEstate_Assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 3. Seed the Database (One-Time)

Place your CSV file (named `truestate_assignment_dataset.csv`) in the `backend/` folder, then run:

```bash
npm run seed
```

> **Note:** The seeder uses batch inserts (5000 records/batch) and limits to 500,000 records to stay within MongoDB Atlas free tier limits.

### 4. Start the Backend Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### `GET /transactions`

Fetch transactions with filters, search, sorting, and pagination.

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | string | `John` | Fuzzy search on CustomerName, ProductName & TransactionID |
| `region` | string | `North,South` | Comma-separated regions (multi-select) |
| `category` | string | `Electronics,Clothing` | Comma-separated categories |
| `status` | string | `Completed,Pending` | Comma-separated order statuses |
| `paymentMethod` | string | `Credit Card,UPI` | Comma-separated payment methods |
| `gender` | string | `Male,Female` | Comma-separated genders |
| `ageMin` | number | `18` | Minimum age |
| `ageMax` | number | `65` | Maximum age |
| `tags` | string | `organic,skincare` | Comma-separated tags (partial match) |
| `startDate` | string | `2024-01-01` | Start date (YYYY-MM-DD) |
| `endDate` | string | `2024-12-31` | End date (YYYY-MM-DD) |
| `sortBy` | string | `FinalAmount` | Field to sort by |
| `sortOrder` | string | `desc` | Sort direction (asc/desc) |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max: 100) |

**Example Request:**
```
GET /api/transactions?region=North,South&category=Electronics&sortBy=FinalAmount&sortOrder=desc&page=1
```

#### `GET /transactions/summary`

Get aggregated summary of ALL matching transactions (same filter params as above).

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalUnits": 1250000,
    "totalAmount": 45000000,
    "totalDiscount": 5000000,
    "totalRecords": 500000
  }
}
```

#### `GET /transactions/filters`

Get unique values for filter dropdowns.

**Response:**
```json
{
  "success": true,
  "filters": {
    "regions": ["East", "North", "South", "West"],
    "categories": ["Clothing", "Electronics", "Food", "..."],
    "statuses": ["Cancelled", "Completed", "Pending"],
    "paymentMethods": ["Credit Card", "Debit Card", "UPI", "..."],
    "tags": ["electronics", "fashion", "organic", "..."]
  }
}
```

---

## 📁 Project Structure

```
TruEstate_Assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── transactionController.js  # API logic with filters
│   │   ├── models/
│   │   │   └── Transaction.js            # Mongoose schema (26 fields)
│   │   ├── routes/
│   │   │   └── transactionRoutes.js      # Route definitions
│   │   ├── services/
│   │   └── utils/
│   ├── index.js                           # Server entry point
│   ├── seed.js                            # Batch CSV import script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx               # Dark navigation sidebar
│   │   │   ├── FilterBar.jsx             # Multi-select filter dropdowns
│   │   │   ├── SummaryCards.jsx          # Aggregated totals display
│   │   │   └── TransactionTable.jsx      # Data table with pagination
│   │   ├── App.jsx                        # Main app with state management
│   │   └── index.css                      # Tailwind styles
│   └── package.json
├── docs/
│   ├── architecture.md                    # System architecture
│   └── deployment.md                      # Deployment guide
└── README.md
```

---

## 🔧 Database Schema

The Transaction model includes 26 fields matching the CSV dataset:

| Field | Type | Description |
|-------|------|-------------|
| TransactionID | Number | Unique transaction identifier |
| Date | Date | Transaction date |
| CustomerID | String | Customer identifier |
| CustomerName | String | Customer full name |
| PhoneNumber | String | Contact number |
| Gender | String | Male/Female |
| Age | Number | Customer age |
| CustomerRegion | String | Geographic region |
| CustomerType | String | Customer classification |
| ProductID | String | Product identifier |
| ProductName | String | Product name |
| Brand | String | Product brand |
| ProductCategory | String | Product category |
| Tags | String | Product tags |
| Quantity | Number | Units purchased |
| PricePerUnit | Number | Unit price |
| DiscountPercentage | Number | Discount applied |
| TotalAmount | Number | Pre-discount total |
| FinalAmount | Number | Post-discount total |
| PaymentMethod | String | Payment type |
| OrderStatus | String | Order status |
| DeliveryType | String | Delivery method |
| StoreID | String | Store identifier |
| StoreLocation | String | Store location |
| SalespersonID | String | Salesperson ID |
| EmployeeName | String | Employee name |

---

## 👤 Author

**Priyam Raj**

Built for TruEstate Coding Assignment
