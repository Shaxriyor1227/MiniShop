import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../utils/i18nHelpers';
import './CategoryPills.css';

const CategoryPills = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation();

  return (
    <div className="category-pills-scroll">
      <button
        className={`pill-btn ${selectedCategory === '' ? 'active' : ''}`}
        onClick={() => onSelectCategory('')}
      >
        {t('catalog.all_categories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id || cat.id}
          className={`pill-btn ${selectedCategory === cat._id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat._id)}
        >
          {getCategoryName(cat, t)}
        </button>
      ))}
    </div>
  );
};

export default React.memo(CategoryPills);
