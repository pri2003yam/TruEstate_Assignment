const Transaction = require('../models/Transaction');

/**
 * Build filter object from query parameters
 * Shared between getTransactions and getSummary
 */
const buildFilterObject = (query) => {
  const {
    search,
    region,
    category,
    status,
    paymentMethod,
    deliveryType,
    gender,
    ageMin,
    ageMax,
    tags,
    startDate,
    endDate
  } = query;

  const filter = {};

  // Fuzzy Search
  if (search && search.trim() !== '') {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { CustomerName: searchRegex },
      { ProductName: searchRegex },
      { TransactionID: !isNaN(search) ? parseInt(search, 10) : -1 }
    ];
  }

  // Multi-Select Filter: CustomerRegion
  if (region && region.trim() !== '') {
    const regionArray = region.split(',').map(r => r.trim()).filter(r => r !== '');
    if (regionArray.length > 0) {
      filter.CustomerRegion = { $in: regionArray };
    }
  }

  // Multi-Select Filter: ProductCategory
  if (category && category.trim() !== '') {
    const categoryArray = category.split(',').map(c => c.trim()).filter(c => c !== '');
    if (categoryArray.length > 0) {
      filter.ProductCategory = { $in: categoryArray };
    }
  }

  // Multi-Select Filter: OrderStatus
  if (status && status.trim() !== '') {
    const statusArray = status.split(',').map(s => s.trim()).filter(s => s !== '');
    if (statusArray.length > 0) {
      filter.OrderStatus = { $in: statusArray };
    }
  }

  // Multi-Select Filter: PaymentMethod
  if (paymentMethod && paymentMethod.trim() !== '') {
    const paymentArray = paymentMethod.split(',').map(p => p.trim()).filter(p => p !== '');
    if (paymentArray.length > 0) {
      filter.PaymentMethod = { $in: paymentArray };
    }
  }

  // Multi-Select Filter: DeliveryType
  if (deliveryType && deliveryType.trim() !== '') {
    const deliveryArray = deliveryType.split(',').map(d => d.trim()).filter(d => d !== '');
    if (deliveryArray.length > 0) {
      filter.DeliveryType = { $in: deliveryArray };
    }
  }

  // Multi-Select Filter: Gender
  if (gender && gender.trim() !== '') {
    const genderArray = gender.split(',').map(g => g.trim()).filter(g => g !== '');
    if (genderArray.length > 0) {
      filter.Gender = { $in: genderArray };
    }
  }

  // Age Range Filter
  if (ageMin || ageMax) {
    filter.Age = {};
    if (ageMin) filter.Age.$gte = parseInt(ageMin, 10);
    if (ageMax) filter.Age.$lte = parseInt(ageMax, 10);
  }

  // Multi-Select Filter: Tags (partial match using $regex)
  if (tags && tags.trim() !== '') {
    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    if (tagsArray.length > 0) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: tagsArray.map(tag => ({ Tags: { $regex: tag, $options: 'i' } }))
      });
    }
  }

  // Date Range Filter
  if (startDate || endDate) {
    filter.Date = {};
    if (startDate) filter.Date.$gte = new Date(startDate);
    if (endDate) filter.Date.$lte = new Date(endDate);
  }

  return filter;
};

/**
 * GET /api/transactions
 * 
 * Handles multi-select filtering, fuzzy search, sorting, and pagination.
 * 
 * Query Parameters:
 * - search: Fuzzy search on CustomerName, ProductName, and TransactionID
 * - region: Comma-separated regions (e.g., "North,South,East")
 * - category: Comma-separated product categories (e.g., "Electronics,Clothing")
 * - status: Comma-separated order statuses (e.g., "Completed,Pending,Cancelled")
 * - paymentMethod: Comma-separated payment methods (e.g., "Credit Card,UPI,Debit Card")
 * - deliveryType: Comma-separated delivery types (e.g., "Standard,Express")
 * - gender: Comma-separated genders (e.g., "Male,Female")
 * - ageMin: Minimum age (e.g., 18)
 * - ageMax: Maximum age (e.g., 65)
 * - tags: Comma-separated tags (e.g., "organic,skincare")
 * - startDate: Start date (e.g., "2024-01-01")
 * - endDate: End date (e.g., "2024-12-31")
 * - sortBy: Field to sort by (default: "Date")
 * - sortOrder: "asc" or "desc" (default: "desc")
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 */
const getTransactions = async (req, res) => {
  try {
    const {
      sortBy = 'Date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object using shared function
    const filter = buildFilterObject(req.query);

    // Build sort object - generic sorting by any field
    const sortOptions = {};
    const order = sortOrder === 'asc' ? 1 : -1;

    // Map common sort field names to schema fields
    const sortFieldMap = {
      'date': 'Date',
      'amount': 'FinalAmount',
      'finalamount': 'FinalAmount',
      'totalamount': 'TotalAmount',
      'name': 'CustomerName',
      'customername': 'CustomerName',
      'productname': 'ProductName',
      'category': 'ProductCategory',
      'productcategory': 'ProductCategory',
      'status': 'OrderStatus',
      'orderstatus': 'OrderStatus',
      'region': 'CustomerRegion',
      'customerregion': 'CustomerRegion',
      'paymentmethod': 'PaymentMethod',
      'transactionid': 'TransactionID'
    };

    // Use mapped field or original field name
    const sortField = sortFieldMap[sortBy.toLowerCase()] || sortBy;
    sortOptions[sortField] = order;

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10)); // Limit between 1-100
    const skip = (pageNumber - 1) * pageSize;

    // Get total count for pagination
    const totalDocuments = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / pageSize);

    // Handle edge case: no data found
    if (totalDocuments === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          totalDocuments: 0,
          totalPages: 0,
          currentPage: pageNumber,
          limit: pageSize,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {
          search: search || null,
          region: region ? region.split(',') : [],
          category: category ? category.split(',') : [],
          status: status ? status.split(',') : [],
          paymentMethod: paymentMethod ? paymentMethod.split(',') : []
        }
      });
    }

    // Fetch transactions with filters, sorting, and pagination
    const transactions = await Transaction.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Return response
    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        totalDocuments,
        totalPages,
        currentPage: pageNumber,
        limit: pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      },
      filters: {
        search: search || null,
        region: region ? region.split(',') : [],
        category: category ? category.split(',') : [],
        status: status ? status.split(',') : [],
        paymentMethod: paymentMethod ? paymentMethod.split(',') : []
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions',
      error: error.message
    });
  }
};

/**
 * GET /api/transactions/filters
 * 
 * Returns unique values for all filterable fields.
 * Used to populate multi-select dropdowns in the frontend.
 */
const getFilterOptions = async (req, res) => {
  try {
    // Get unique values for each filterable field using aggregation
    const [regions, categories, statuses, paymentMethods, deliveryTypes, brands, tagsRaw] = await Promise.all([
      Transaction.distinct('CustomerRegion'),
      Transaction.distinct('ProductCategory'),
      Transaction.distinct('OrderStatus'),
      Transaction.distinct('PaymentMethod'),
      Transaction.distinct('DeliveryType'),
      Transaction.distinct('Brand'),
      Transaction.distinct('Tags')
    ]);
    
    // Parse tags - they may be comma-separated strings in the DB
    const allTags = new Set();
    tagsRaw.filter(Boolean).forEach(tagStr => {
      tagStr.split(',').forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) allTags.add(trimmed);
      });
    });

    res.status(200).json({
      success: true,
      filters: {
        regions: regions.filter(Boolean).sort(),
        categories: categories.filter(Boolean).sort(),
        statuses: statuses.filter(Boolean).sort(),
        paymentMethods: paymentMethods.filter(Boolean).sort(),
        deliveryTypes: deliveryTypes.filter(Boolean).sort(),
        brands: brands.filter(Boolean).sort(),
        tags: [...allTags].sort()
      }
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching filter options',
      error: error.message
    });
  }
};

/**
 * GET /api/transactions/summary
 * 
 * Returns aggregated summary of ALL matching transactions (not just current page).
 * Uses same filters as getTransactions.
 */
const getSummary = async (req, res) => {
  try {
    // Build filter object using shared function
    const filter = buildFilterObject(req.query);

    // Aggregation to calculate totals from ALL matching documents
    const summaryResult = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$Quantity' },
          totalAmount: { $sum: '$FinalAmount' },
          totalDiscount: { $sum: { $subtract: ['$TotalAmount', '$FinalAmount'] } },
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = summaryResult[0] || {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      count: 0
    };

    res.status(200).json({
      success: true,
      summary: {
        totalUnits: summary.totalUnits,
        totalAmount: summary.totalAmount,
        totalDiscount: summary.totalDiscount,
        totalRecords: summary.count
      }
    });

  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching summary',
      error: error.message
    });
  }
};

module.exports = {
  getTransactions,
  getFilterOptions,
  getSummary
};
