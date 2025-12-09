# TruEstate Assignment

A full-stack MERN application for managing and visualizing transaction data with advanced multi-select filtering, fuzzy search, sorting, and pagination capabilities.

---

## 📋 Overview

This project is a **Transaction Management Dashboard** built as part of a coding assignment. It demonstrates a complete data pipeline from CSV import to a fully interactive web interface.

### Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Select Filtering** | Filter by multiple Regions, Categories, Statuses simultaneously |
| **Fuzzy Search** | Search by Customer Name or Transaction ID with regex matching |
| **Smart Sorting** | Sort by any column (Date, Amount, Name, etc.) in asc/desc order |
| **Pagination** | Navigate through large datasets with 10 items per page |
| **Dark Sidebar** | Professional dashboard UI with pink accent theme |
| **Data Seeding** | One-time CSV import script to populate MongoDB |

### Screenshots

```
┌─────────────────────────────────────────────────────────────────┐
│ [Dark Sidebar]  │  Dashboard                                    │
│                 │  ┌─────────────────────────────────────────┐  │
│  ● Dashboard    │  │ Search... │ Region ▼ │ Category ▼ │     │  │
│  ○ Nexus        │  └─────────────────────────────────────────┘  │
│  ○ Services     │                                               │
│  ○ Invoices     │  ┌─────────────────────────────────────────┐  │
│                 │  │ ID │ Date │ Customer │ Amount │ Status  │  │
│                 │  ├─────────────────────────────────────────┤  │
│                 │  │    │      │          │        │         │  │
│                 │  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI framework |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **HTTP Client** | Axios | API communication |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB Atlas | Cloud NoSQL database |
| **ODM** | Mongoose | Schema validation & queries |
| **Data Import** | csv-parser | CSV to MongoDB seeding |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account ([Create free cluster](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TruEstate_Assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 3. Seed the Database (One-Time)

Place your `data.csv` file in the `backend/` folder, then run:

```bash
npm run seed
```

Expected output:
```
🌱 Starting Database Seeder...
✅ MongoDB connected successfully
📄 Parsed 500 rows from CSV
✅ Successfully inserted 500 transactions
🎉 Database seeding completed successfully!
```

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

### 6. Open the Application

Navigate to `http://localhost:5173` in your browser.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### `GET /transactions`

Fetch transactions with filters, search, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | string | `John` | Fuzzy search on CustomerName & TransactionID |
| `region` | string | `North,South` | Comma-separated regions (multi-select) |
| `category` | string | `Electronics,Clothing` | Comma-separated categories |
| `status` | string | `Completed,Pending` | Comma-separated statuses |
| `paymentMethod` | string | `Credit Card,PayPal` | Comma-separated payment methods |
| `sortBy` | string | `Amount` | Field to sort by |
| `sortOrder` | string | `desc` | Sort direction (asc/desc) |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max: 100) |

**Example Request:**
```
GET /api/transactions?region=North,South&category=Electronics&sortBy=Amount&sortOrder=desc&page=1
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "totalDocuments": 150,
    "totalPages": 15,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "region": ["North", "South"],
    "category": ["Electronics"]
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
    "categories": ["Clothing", "Electronics", "Food"],
    "statuses": ["Cancelled", "Completed", "Pending"],
    "paymentMethods": ["Credit Card", "Debit Card", "PayPal"]
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
│   │   │   └── transactionController.js  # API logic
│   │   ├── models/
│   │   │   └── Transaction.js            # Mongoose schema
│   │   ├── routes/
│   │   │   └── transactionRoutes.js      # Route definitions
│   │   ├── services/                      # Business logic
│   │   └── utils/                         # Helper functions
│   ├── index.js                           # Server entry point
│   ├── seed.js                            # CSV import script
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx                 # Main layout
│   │   │   ├── Sidebar.jsx                # Dark navigation
│   │   │   ├── MultiSelect.jsx            # Filter dropdowns
│   │   │   └── TransactionTable.jsx       # Data table
│   │   ├── App.jsx                        # Main app component
│   │   ├── main.jsx                       # React entry
│   │   └── index.css                      # Tailwind styles
│   ├── vercel.json                        # Deployment config
│   ├── tailwind.config.js
│   └── package.json
├── docs/
│   ├── architecture.md                    # System architecture
│   └── deployment.md                      # Deployment guide
└── README.md
```

---

## 🌐 Deployment

### Backend → Render.com

1. Create new Web Service on Render
2. Set Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variable: `MONGODB_URI`

### Frontend → Vercel

1. Import project on Vercel
2. Set Root Directory: `frontend`
3. Deploy automatically

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

---

## 📄 License

ISC

---

## 👤 Author

Built for TruEstate Coding Assignment
