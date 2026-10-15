import React from 'react';
import { PackageOpen } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Ma\'lumot topilmadi',
  description = 'Ushbu bo\'limda hozircha ma\'lumotlar mavjud emas.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-icon-wrap">
        <Icon size={36} />
      </div>
      <h4 className="admin-empty-title">{title}</h4>
      <p className="admin-empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
