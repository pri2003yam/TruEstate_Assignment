import { useState, useRef, useEffect } from 'react';

const FilterDropdown = ({ label, options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayText = selected.length === 0 
    ? placeholder 
    : selected.length === 1 
      ? selected[0] 
      : `${selected.length} selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
          selected.length > 0 
            ? 'bg-pink-50 border-pink-200 text-pink-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span>{label}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options</div>
          ) : (
            options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const FilterBar = ({ filters, filterOptions, onFilterChange, onClear, sortBy, sortOrder, onSortChange }) => {
  const genderOptions = ['Male', 'Female'];
  const ageRangeOptions = ['18-25', '26-35', '36-45', '46-55', '56-65'];

  return (
    <div className="px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Customer Region Filter */}
        <FilterDropdown
          label="Customer Region"
          options={filterOptions.regions || []}
          selected={filters.regions}
          onChange={(val) => onFilterChange('regions', val)}
          placeholder="All Regions"
        />

        {/* Gender Filter */}
        <FilterDropdown
          label="Gender"
          options={genderOptions}
          selected={filters.genders}
          onChange={(val) => onFilterChange('genders', val)}
          placeholder="All"
        />

        {/* Age Range Filter */}
        <FilterDropdown
          label="Age Range"
          options={ageRangeOptions}
          selected={filters.ageRange?.selected || []}
          onChange={(val) => onFilterChange('ageRange', { ...filters.ageRange, selected: val })}
          placeholder="All Ages"
        />

        {/* Product Category Filter */}
        <FilterDropdown
          label="Product Category"
          options={filterOptions.categories || []}
          selected={filters.categories}
          onChange={(val) => onFilterChange('categories', val)}
          placeholder="All Categories"
        />

        {/* Tags Filter */}
        <FilterDropdown
          label="Tags"
          options={filterOptions.tags || []}
          selected={filters.tags}
          onChange={(val) => onFilterChange('tags', val)}
          placeholder="All Tags"
        />

        {/* Payment Method Filter */}
        <FilterDropdown
          label="Payment Method"
          options={filterOptions.paymentMethods || []}
          selected={filters.paymentMethods}
          onChange={(val) => onFilterChange('paymentMethods', val)}
          placeholder="All Methods"
        />

        {/* Date Filter */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
          <span>Date</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              // Call parent handler with both field and order
              if (typeof onSortChange === 'function') {
                onSortChange(field, order);
              }
            }}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="CustomerName-asc">Customer Name (A-Z)</option>
            <option value="CustomerName-desc">Customer Name (Z-A)</option>
            <option value="Date-desc">Date (Newest)</option>
            <option value="Date-asc">Date (Oldest)</option>
            <option value="FinalAmount-desc">Amount (High-Low)</option>
            <option value="FinalAmount-asc">Amount (Low-High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
