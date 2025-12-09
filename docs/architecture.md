# Architecture Documentation

## System Overview

This document explains the complete data flow and architecture of the TruEstate Transaction Dashboard, from CSV data import to the interactive React UI.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COMPLETE DATA FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────┐         ┌──────────────┐         ┌──────────────────────┐
   │          │  seed   │              │  store  │                      │
   │ data.csv │ ──────► │   seed.js    │ ──────► │   MongoDB Atlas      │
   │          │         │  (one-time)  │         │   (transactions)     │
   └──────────┘         └──────────────┘         └──────────────────────┘
                                                           │
                                                           │ query
                                                           ▼
┌─────────────────┐     ┌──────────────┐         ┌──────────────────────┐
│                 │ GET │              │  find   │                      │
│   React UI      │ ◄── │ Express API  │ ◄────── │   Mongoose ODM       │
│   (Frontend)    │     │  (Backend)   │         │                      │
└─────────────────┘     └──────────────┘         └──────────────────────┘
        │                      ▲
        │  HTTP Request        │
        │  with filters        │
        └──────────────────────┘

```

---

## Phase 1: Data Seeding (CSV → MongoDB)

### Process Flow

```
data.csv → fs.createReadStream() → csv-parser → Transform → MongoDB.insertMany()
```

### How It Works

1. **Read CSV**: The `seed.js` script reads `data.csv` using Node.js `fs` module
2. **Parse Rows**: `csv-parser` converts each CSV row into a JavaScript object
3. **Transform Data**: Field names are normalized to match the Mongoose schema
4. **Clear Collection**: Existing documents are deleted to prevent duplicates
5. **Bulk Insert**: All parsed documents are inserted using `insertMany()`

### Code Example (seed.js)

```javascript
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    const transaction = {
      TransactionID: row.TransactionID,
      CustomerName: row.CustomerName,
      Amount: parseFloat(row.Amount),
      // ... other fields
    };
    results.push(transaction);
  })
  .on('end', async () => {
    await Transaction.deleteMany({});  // Clear existing
    await Transaction.insertMany(results);  // Insert all
  });
```

---

## Phase 2: API Layer (Express → MongoDB)

### Request Flow

```
HTTP Request → Express Router → Controller → Mongoose Query → MongoDB → Response
```

### API Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐    ┌─────────────────┐    ┌───────────────┐  │
│  │   Routes    │    │   Controller    │    │    Model      │  │
│  │             │    │                 │    │               │  │
│  │ GET /api/   │───►│ getTransactions │───►│ Transaction   │  │
│  │ transactions│    │                 │    │   .find()     │  │
│  │             │    │ - Build filter  │    │   .sort()     │  │
│  │ GET /api/   │    │ - Parse params  │    │   .skip()     │  │
│  │ /filters    │───►│ - Execute query │    │   .limit()    │  │
│  │             │    │ - Format resp.  │    │               │  │
│  └─────────────┘    └─────────────────┘    └───────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Multi-Select Filter Logic

### How Multi-Select Works

The multi-select filtering is the core feature that allows users to filter by multiple values simultaneously.

#### Frontend → API

```javascript
// User selects multiple regions: ["North", "South"]
// Frontend joins with commas before sending

const selectedRegions = ["North", "South"];
const selectedCategories = ["Electronics", "Clothing"];

// API call becomes:
// GET /api/transactions?region=North,South&category=Electronics,Clothing

params.append('region', selectedRegions.join(','));
params.append('category', selectedCategories.join(','));
```

#### API → MongoDB Query

```javascript
// Backend receives: region=North,South
// Splits into array and uses $in operator

if (region && region.trim() !== '') {
  const regionArray = region.split(',').map(r => r.trim());
  filter.Region = { $in: regionArray };
}

// Resulting MongoDB filter object:
// { Region: { $in: ["North", "South"] } }
```

#### MongoDB $in Operator

```javascript
// The $in operator matches any document where the field
// equals ANY of the values in the array

db.transactions.find({
  Region: { $in: ["North", "South"] },
  ProductCategory: { $in: ["Electronics", "Clothing"] }
})

// This returns transactions where:
// - Region is "North" OR "South"
// - AND ProductCategory is "Electronics" OR "Clothing"
```

### Complete Filter Building Process

```javascript
const filter = {};

// 1. Fuzzy Search (OR condition across multiple fields)
if (search) {
  filter.$or = [
    { CustomerName: { $regex: search, $options: 'i' } },
    { TransactionID: { $regex: search, $options: 'i' } }
  ];
}

// 2. Multi-Select Filters (comma-separated → $in)
if (region) {
  filter.Region = { $in: region.split(',') };
}
if (category) {
  filter.ProductCategory = { $in: category.split(',') };
}
if (status) {
  filter.Status = { $in: status.split(',') };
}

// 3. Final Query with Pagination
const results = await Transaction.find(filter)
  .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## Phase 4: React UI (Frontend)

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.jsx                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ State: transactions, filters, pagination, search, sort   │  │
│  │ Effects: fetchTransactions(), fetchFilterOptions()       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────┐    ┌───────────────┐    ┌──────────────────┐  │
│  │   Layout    │    │  MultiSelect  │    │ TransactionTable │  │
│  │  + Sidebar  │    │   (x4 filters)│    │   + Pagination   │  │
│  └─────────────┘    └───────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### State Management Flow

```javascript
// 1. User clicks checkbox in MultiSelect
setSelectedRegions(['North', 'South']);

// 2. useEffect detects state change
useEffect(() => {
  fetchTransactions();
}, [selectedRegions, selectedCategories, ...]);

// 3. fetchTransactions builds query string
const params = new URLSearchParams();
if (selectedRegions.length > 0) {
  params.append('region', selectedRegions.join(','));
}

// 4. API returns filtered data
const response = await axios.get(`/api/transactions?${params}`);

// 5. State updates trigger re-render
setTransactions(response.data.data);
setPagination(response.data.pagination);
```

---

## Data Models

### Transaction Schema

```javascript
{
  TransactionID: String,     // Unique identifier
  CustomerName: String,      // Searchable field
  ProductCategory: String,   // Filterable (multi-select)
  PaymentMethod: String,     // Filterable (multi-select)
  Region: String,            // Filterable (multi-select)
  Status: String,            // Filterable (multi-select)
  Amount: Number,            // Sortable
  TransactionDate: Date      // Sortable
}
```

### API Response Format

```javascript
{
  success: true,
  data: [/* array of transactions */],
  pagination: {
    totalDocuments: 500,
    totalPages: 50,
    currentPage: 1,
    limit: 10,
    hasNextPage: true,
    hasPrevPage: false
  },
  filters: {
    region: ["North", "South"],
    category: ["Electronics"],
    status: [],
    paymentMethod: []
  }
}
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Comma-separated filters** | Simple URL format, easy to share/bookmark |
| **$in operator** | Efficient MongoDB query for OR conditions |
| **Server-side pagination** | Handles large datasets efficiently |
| **Dynamic filter options** | Fetched from DB to reflect actual data |
| **Fuzzy search with $regex** | Flexible, case-insensitive matching |
| **Separate seed script** | One-time import, keeps CSV out of production |

---

## Performance Considerations

1. **Indexing**: Add MongoDB indexes on frequently queried fields
   ```javascript
   transactionSchema.index({ Region: 1, Status: 1 });
   transactionSchema.index({ CustomerName: 'text' });
   ```

2. **Pagination**: Always use skip/limit to prevent loading entire collection

3. **Debouncing**: Search input debounced to reduce API calls

4. **Caching**: Filter options cached on frontend to reduce requests
