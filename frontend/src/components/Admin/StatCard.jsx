import React from 'react';
import './StatCard.css';

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  color = 'blue',
  onClick
}) => {
  return (
    <div
      className={`admin-stat-card theme-${color} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-wrap">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {(subtitle || trend !== undefined) && (
        <div className="stat-card-bottom">
          {trend !== undefined && (
            <span className={`stat-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {trendLabel && <span className="stat-trend-label">{trendLabel}</span>}
          {subtitle && !trendLabel && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
