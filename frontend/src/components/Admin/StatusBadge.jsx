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
import './StatusBadge.css';

const StatusBadge = ({ status, type = 'order' }) => {
  // Normalize string
  const s = String(status || '').toLowerCase();

  let label = status;
  let icon = null;
  let styleClass = 'default';

  if (type === 'order') {
    switch (s) {
      case 'paid':
        label = "To'langan";
        icon = <Check size={12} />;
        styleClass = 'badge-success';
        break;
      case 'shipped':
        label = "Yo'lda";
        icon = <Truck size={12} />;
        styleClass = 'badge-info';
        break;
      case 'delivered':
        label = 'Yetkazildi';
        icon = <CheckCircle2 size={12} />;
        styleClass = 'badge-success';
        break;
      case 'cancelled':
        label = 'Bekor qilindi';
        icon = <XCircle size={12} />;
        styleClass = 'badge-danger';
        break;
      default:
        label = 'Kutilmoqda';
        icon = <Clock size={12} />;
        styleClass = 'badge-warning';
    }
  } else if (type === 'user_role') {
    if (s === 'admin') {
      label = 'Admin';
      icon = <Shield size={12} />;
      styleClass = 'badge-purple';
    } else {
      label = 'Mijoz';
      icon = <User size={12} />;
      styleClass = 'badge-neutral';
    }
  } else if (type === 'user_status') {
    if (s === 'blocked' || status === true) {
      label = 'Bloklangan';
      icon = <Ban size={12} />;
      styleClass = 'badge-danger';
    } else {
      label = 'Faol';
      icon = <CheckCircle size={12} />;
      styleClass = 'badge-success';
    }
  } else if (type === 'coupon') {
    if (status === true || s === 'active') {
      label = 'Faol';
      icon = <Tag size={12} />;
      styleClass = 'badge-success';
    } else {
      label = 'Nofaol';
      icon = <XCircle size={12} />;
      styleClass = 'badge-neutral';
    }
  } else if (type === 'payment') {
    if (s === 'completed') {
      label = 'Muvaffaqiyatli';
      icon = <Check size={12} />;
      styleClass = 'badge-success';
    } else if (s === 'failed') {
      label = 'Xatolik';
      icon = <XCircle size={12} />;
      styleClass = 'badge-danger';
    } else {
      label = 'Kutilmoqda';
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
