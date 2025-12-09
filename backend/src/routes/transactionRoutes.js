const express = require('express');
const router = express.Router();
const { getTransactions, getFilterOptions, getSummary } = require('../controllers/transactionController');

// GET /api/transactions - Get transactions with filters, search, sort, pagination
router.get('/', getTransactions);

// GET /api/transactions/filters - Get unique filter options for dropdowns
router.get('/filters', getFilterOptions);

// GET /api/transactions/summary - Get aggregated summary of all matching transactions
router.get('/summary', getSummary);

module.exports = router;
