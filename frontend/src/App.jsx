import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import SummaryCards from './components/SummaryCards';
import TransactionTable from './components/TransactionTable';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  // Data state
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    totalDocuments: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    statuses: [],
    paymentMethods: [],
    deliveryTypes: [],
    brands: [],
    tags: [],
  });

  // Summary data
  const [summary, setSummary] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    regions: [],
    categories: [],
    statuses: [],
    paymentMethods: [],
    genders: [],
    ageRange: { min: '', max: '' },
    tags: [],
    dateRange: { start: '', end: '' },
  });

  // Sort state
  const [sortBy, setSortBy] = useState('CustomerName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Page state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/transactions/filters`);
        if (response.data.success) {
          setFilterOptions(response.data.filters);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      // Search
      if (filters.search) params.append('search', filters.search);
      
      // Multi-select filters
      if (filters.regions.length > 0) {
        params.append('region', filters.regions.join(','));
      }
      if (filters.categories.length > 0) {
        params.append('category', filters.categories.join(','));
      }
      if (filters.statuses.length > 0) {
        params.append('status', filters.statuses.join(','));
      }
      if (filters.paymentMethods.length > 0) {
        params.append('paymentMethod', filters.paymentMethods.join(','));
      }
      
      // Gender filter
      if (filters.genders.length > 0) {
        params.append('gender', filters.genders.join(','));
      }
      
      // Age range filter
      if (filters.ageRange?.selected?.length > 0) {
        // Parse age range strings like "18-25" to get min/max
        const ages = filters.ageRange.selected.flatMap(range => {
          const [min, max] = range.split('-').map(Number);
          return [min, max];
        });
        params.append('ageMin', Math.min(...ages).toString());
        params.append('ageMax', Math.max(...ages).toString());
      }
      
      // Tags filter
      if (filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      
      // Date range filter
      if (filters.dateRange?.start) {
        params.append('startDate', filters.dateRange.start);
      }
      if (filters.dateRange?.end) {
        params.append('endDate', filters.dateRange.end);
      }
      
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      // Fetch transactions and summary in parallel
      const [transResponse, summaryResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/transactions?${params.toString()}`),
        axios.get(`${API_BASE_URL}/transactions/summary?${params.toString()}`)
      ]);

      if (transResponse.data.success) {
        setTransactions(transResponse.data.data);
        setPagination(transResponse.data.pagination);
      } else {
        setError('Failed to fetch transactions');
      }
      
      if (summaryResponse.data.success) {
        setSummary(summaryResponse.data.summary);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder, page, limit]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  // Handle sort change - now accepts both field and order from dropdown
  const handleSortChange = (field, order) => {
    if (order) {
      // Called from dropdown with explicit order
      setSortBy(field);
      setSortOrder(order);
    } else {
      // Called from table header - toggle order
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      regions: [],
      categories: [],
      statuses: [],
      paymentMethods: [],
      genders: [],
      ageRange: { min: '', max: '' },
      tags: [],
      dateRange: { start: '', end: '' },
    });
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Sales Management System</h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name, Phone no."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClear={clearFilters}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        {/* Summary Cards */}
        <SummaryCards summary={summary} totalRecords={pagination.totalDocuments} />

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
              <button onClick={fetchTransactions} className="ml-auto px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded-lg">
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </main>
    </div>
  );
}

export default App;
