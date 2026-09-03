import React from 'react';
import './CategoryPills.css';

const CategoryPills = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-pills-scroll">
      <button
        className={`pill-btn ${selectedCategory === '' ? 'active' : ''}`}
        onClick={() => onSelectCategory('')}
      >
        All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id || cat.id}
          className={`pill-btn ${selectedCategory === cat._id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat._id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;
