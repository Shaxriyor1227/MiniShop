import React from 'react';
import './PageSkeleton.css';

export const PageSkeleton = () => {
  return (
    <div className="page-skeleton-wrapper" aria-hidden="true">
      <div className="page-skeleton-hero shimmer" />
      <div className="page-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="page-skeleton-card">
            <div className="card-thumb shimmer" />
            <div className="card-line-title shimmer" />
            <div className="card-line-subtitle shimmer" />
            <div className="card-line-price shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
