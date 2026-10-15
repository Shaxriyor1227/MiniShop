import React from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Check,
  XCircle,
  Shield,
  User,
  Ban,
  CheckCircle,
  Tag
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './StatusBadge.css';

const StatusBadge = ({ status, type = 'order' }) => {
  const { t } = useTranslation();
  const s = String(status || '').toLowerCase();

  let label = status;
  let icon = null;
  let styleClass = 'default';

  if (type === 'order') {
    switch (s) {
      case 'paid':
        label = t('admin.status.paid');
        icon = <Check size={12} />;
        styleClass = 'badge-success';
        break;
      case 'shipped':
        label = t('admin.status.shipped');
        icon = <Truck size={12} />;
        styleClass = 'badge-info';
        break;
      case 'delivered':
        label = t('admin.status.delivered');
        icon = <CheckCircle2 size={12} />;
        styleClass = 'badge-success';
        break;
      case 'cancelled':
        label = t('admin.status.cancelled');
        icon = <XCircle size={12} />;
        styleClass = 'badge-danger';
        break;
      default:
        label = t('admin.status.pending');
        icon = <Clock size={12} />;
        styleClass = 'badge-warning';
    }
  } else if (type === 'user_role') {
    if (s === 'admin') {
      label = t('admin.status.admin');
      icon = <Shield size={12} />;
      styleClass = 'badge-purple';
    } else {
      label = t('admin.status.customer');
      icon = <User size={12} />;
      styleClass = 'badge-neutral';
    }
  } else if (type === 'user_status') {
    if (s === 'blocked' || status === true) {
      label = t('admin.status.blocked');
      icon = <Ban size={12} />;
      styleClass = 'badge-danger';
    } else {
      label = t('admin.status.active');
      icon = <CheckCircle size={12} />;
      styleClass = 'badge-success';
    }
  } else if (type === 'coupon') {
    if (status === true || s === 'active') {
      label = t('admin.status.active');
      icon = <Tag size={12} />;
      styleClass = 'badge-success';
    } else {
      label = t('admin.status.inactive');
      icon = <XCircle size={12} />;
      styleClass = 'badge-neutral';
    }
  } else if (type === 'payment') {
    if (s === 'completed') {
      label = t('admin.status.completed');
      icon = <Check size={12} />;
      styleClass = 'badge-success';
    } else if (s === 'failed') {
      label = t('admin.status.failed');
      icon = <XCircle size={12} />;
      styleClass = 'badge-danger';
    } else {
      label = t('admin.status.pending');
      icon = <Clock size={12} />;
      styleClass = 'badge-warning';
    }
  }

  return (
    <span className={`admin-status-badge ${styleClass}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
