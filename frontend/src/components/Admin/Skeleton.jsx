import React from 'react';
import './Skeleton.css';

export const CardSkeleton = () => (
  <div className="admin-skeleton-card">
    <div className="skeleton-line title" />
    <div className="skeleton-line value" />
    <div className="skeleton-line subtitle" />
  </div>
);

export const ChartSkeleton = ({ height = '300px' }) => (
  <div className="admin-skeleton-chart" style={{ height }}>
    <div className="skeleton-line full" />
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="admin-skeleton-table">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="skeleton-row">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
);

export default { CardSkeleton, ChartSkeleton, TableSkeleton };
