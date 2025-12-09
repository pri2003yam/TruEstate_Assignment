const TransactionTable = ({ 
  transactions, 
  pagination, 
  onPageChange, 
  loading,
  sortBy,
  sortOrder,
  onSortChange 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  const formatPhone = (phone) => {
    if (!phone) return '-';
    return `+91 ${phone}`;
  };

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    return (
      <span className="ml-1 inline-flex">
        {sortOrder === 'asc' ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  // Sortable header component
  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => onSortChange(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIndicator field={field} />
      </div>
    </th>
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pages = [];
    
    // Show max 5 pages
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="bg-white border-t border-gray-200">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-3 text-gray-500">Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white border-t border-gray-200">
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No transactions found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <SortableHeader field="TransactionID">Transaction ID</SortableHeader>
              <SortableHeader field="Date">Date</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer ID</th>
              <SortableHeader field="CustomerName">Customer name</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Phone Number</th>
              <SortableHeader field="Gender">Gender</SortableHeader>
              <SortableHeader field="Age">Age</SortableHeader>
              <SortableHeader field="ProductCategory">Product Category</SortableHeader>
              <SortableHeader field="Quantity">Quantity</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-gray-900">{transaction.TransactionID || '-'}</td>
                <td className="px-4 py-4 text-gray-600">{formatDate(transaction.Date)}</td>
                <td className="px-4 py-4 text-blue-600 font-medium">{transaction.CustomerID || '-'}</td>
                <td className="px-4 py-4 text-gray-900">{transaction.CustomerName || '-'}</td>
                <td className="px-4 py-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    {formatPhone(transaction.PhoneNumber)}
                    <button className="text-gray-400 hover:text-gray-600 ml-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600">{transaction.Gender || '-'}</td>
                <td className="px-4 py-4 text-gray-600">{transaction.Age || '-'}</td>
                <td className="px-4 py-4 text-gray-900 font-medium">{transaction.ProductCategory || '-'}</td>
                <td className="px-4 py-4 text-gray-900 font-medium">{String(transaction.Quantity || 0).padStart(2, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination with First/Last buttons */}
      <div className="flex items-center justify-center py-4 border-t border-gray-200">
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.currentPage === 1}
            className={`px-3 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
              pagination.currentPage === 1
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            First
          </button>
          
          {/* Previous */}
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
              !pagination.hasPrevPage
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                pageNum === pagination.currentPage
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {/* Next */}
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
              !pagination.hasNextPage
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-3 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
              pagination.currentPage === pagination.totalPages
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
