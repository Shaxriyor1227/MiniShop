import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './DataTable.css';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  actions,
  pagination,
  emptyMessage,
  onSort,
  sortField,
  sortOrder
}) => {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (localSearch === searchValue) return;
    const timer = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchValue, onSearchChange]);

  const finalPlaceholder = searchPlaceholder || t('admin.table.search_placeholder');
  const finalEmptyMessage = emptyMessage || t('admin.table.empty_message');

  return (
    <div className="admin-datatable-wrapper">
      {(onSearchChange || actions) && (
        <div className="admin-datatable-header">
          {onSearchChange ? (
            <div className="admin-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={finalPlaceholder}
                className="admin-search-input"
              />
              {localSearch && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setLocalSearch('');
                    onSearchChange?.('');
                  }}
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
                  {finalEmptyMessage}
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
            {t('admin.table.total_records')} <strong>{pagination.total || data.length}</strong> {t('admin.table.records_suffix')}
            {pagination.totalPages > 1 && (
              <span> • {t('admin.table.page_prefix')} {pagination.page} {t('admin.table.page_of')} {pagination.totalPages}</span>
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
                <span>{t('admin.table.prev')}</span>
              </button>
              <span className="page-indicator">{pagination.page}</span>
              <button
                className="pagination-btn"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              >
                <span>{t('admin.table.next')}</span>
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
