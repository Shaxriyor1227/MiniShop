import React from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import './DataTable.css';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Qidirish...',
  actions,
  pagination,
  emptyMessage = 'Hech qanday ma\'lumot topilmadi',
  onSort,
  sortField,
  sortOrder
}) => {
  return (
    <div className="admin-datatable-wrapper">
      {(onSearchChange || actions) && (
        <div className="admin-datatable-header">
          {onSearchChange ? (
            <div className="admin-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="admin-search-input"
              />
              {searchValue && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => onSearchChange('')}
                >
                  &times;
                </button>
              )}
            </div>
          ) : <div />}

          {actions && <div className="admin-datatable-actions">{actions}</div>}
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  className={col.sortable ? 'sortable-th' : ''}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className="th-content" style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        size={13}
                        className={`sort-icon ${sortField === col.key ? (sortOrder === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="loading-row">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx}>
                      <div className="admin-skeleton-line" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-table-cell">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr key={row._id || rIdx} className="admin-table-row">
                  {columns.map((col, cIdx) => (
                    <td
                      key={col.key || cIdx}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row[col.key], row, rIdx) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="admin-pagination">
          <div className="pagination-info">
            Jami: <strong>{pagination.total || data.length}</strong> ta yozuv
            {pagination.totalPages > 1 && (
              <span> • Sahifa {pagination.page} / {pagination.totalPages}</span>
            )}
          </div>
          {pagination.totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={pagination.page <= 1 || loading}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
              >
                <ChevronLeft size={16} />
                <span>Oldingi</span>
              </button>
              <span className="page-indicator">{pagination.page}</span>
              <button
                className="pagination-btn"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              >
                <span>Keyingi</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
