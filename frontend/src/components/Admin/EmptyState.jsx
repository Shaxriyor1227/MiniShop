import React from 'react';
import { PackageOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './EmptyState.css';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction
}) => {
  const { t } = useTranslation();

  return (
    <div className="admin-empty-state">
      <div className="admin-empty-icon-wrap">
        <Icon size={36} />
      </div>
      <h4 className="admin-empty-title">{title || t('admin.empty.title')}</h4>
      <p className="admin-empty-desc">{description || t('admin.empty.desc')}</p>
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
