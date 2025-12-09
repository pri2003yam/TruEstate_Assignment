const SummaryCards = ({ summary, totalRecords }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Total Units Sold */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Total units sold
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-lg font-semibold text-gray-900">{summary.totalUnits}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-500 text-sm">₹</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Total Amount
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.totalAmount)} ({totalRecords} SRs)
            </span>
          </div>
        </div>

        {/* Total Discount */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Total Discount
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.totalDiscount)} ({totalRecords} SRs)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
