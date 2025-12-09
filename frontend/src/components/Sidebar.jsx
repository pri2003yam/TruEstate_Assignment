import { useState } from 'react';

const Sidebar = () => {
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = useState(true);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <span className="text-lg font-semibold text-white">Vault</span>
            <p className="text-xs text-slate-400">Priyam Raj</p>
          </div>
          <svg className="w-4 h-4 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
          </li>

          {/* Nexus */}
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium">Nexus</span>
            </a>
          </li>

          {/* Intake */}
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Intake</span>
            </a>
          </li>

          {/* Services Section */}
          <li>
            <button
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-medium">Services</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${servicesExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesExpanded && (
              <ul className="mt-1 ml-8 space-y-1">
                <li>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Pre-active
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Active
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Blocked
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Closed
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Invoices Section */}
          <li>
            <button
              onClick={() => setInvoicesExpanded(!invoicesExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Invoices</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${invoicesExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {invoicesExpanded && (
              <ul className="mt-1 ml-8 space-y-1">
                <li>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Proforma Invoices
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Final Invoices
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
