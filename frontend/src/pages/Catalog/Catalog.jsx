import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from '../../components/ProductCard/ProductCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Filter,
  ChevronDown,
  Layers,
  Headphones,
  Watch,
  Laptop,
  Lightbulb,
  Tag,
  CheckSquare,
  Square
} from 'lucide-react';
import './Catalog.css';

const priceRanges = [
  { labelKey: 'catalog.all_prices', defaultLabel: 'All Prices', min: 0, max: Infinity },
  { labelKey: 'catalog.under_50', defaultLabel: 'Under $50', min: 0, max: 50 },
  { labelKey: 'catalog.50_150', defaultLabel: '$50 to $150', min: 50, max: 150 },
  { labelKey: 'catalog.150_300', defaultLabel: '$150 to $300', min: 150, max: 300 },
  { labelKey: 'catalog.over_300', defaultLabel: 'Over $300', min: 300, max: Infinity }
];

const categoryIcons = {
  Audio: Headphones,
  Wearables: Watch,
  Workspace: Layers,
  Accessories: Tag,
  'Smart Home': Lightbulb,
  'Laptops & PCs': Laptop
};

const Catalog = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const desktopSortRef = useRef(null);
  const mobileSortRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopSortRef.current && !desktopSortRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
      if (mobileSortRef.current && !mobileSortRef.current.contains(e.target)) {
        setMobileSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch categories & brands metadata
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axiosInstance.get('/category/getAll'),
          axiosInstance.get('/brand/getAll')
        ]);
        if (catRes.data.success && catRes.data.innerData) {
          setCategories(catRes.data.innerData);
        }
        if (brandRes.data.success && brandRes.data.innerData) {
          setBrands(brandRes.data.innerData);
        }
      } catch (err) {
        console.error('[Catalog Meta Error]:', err);
      }
    };
    fetchMeta();
  }, []);

  // Sync category param from URL
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const match = categories.find((c) => c.name.toLowerCase() === categoryParam.toLowerCase());
      if (match) setSelectedCategory(match._id);
    } else if (!categoryParam) {
      setSelectedCategory('');
    }
  }, [categoryParam, categories]);

  // Sync brand param from URL
  useEffect(() => {
    if (brandParam && brands.length > 0) {
      const match = brands.find((b) => b.name.toLowerCase() === brandParam.toLowerCase());
      if (match) setSelectedBrand(match._id);
    } else if (!brandParam) {
      setSelectedBrand('');
    }
  }, [brandParam, brands]);

  // Sync search input
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (searchParam) params.search = searchParam;
      if (sortBy && sortBy !== 'featured') params.sort = sortBy;

      const res = await axiosInstance.get('/product/getAll', { params });
      if (res.data.success) {
        let prods = res.data.innerData;

        // Apply in-memory price range filter
        const range = priceRanges[selectedPriceRange];
        if (range.min > 0 || range.max < Infinity) {
          prods = prods.filter((p) => p.price >= range.min && p.price < range.max);
        }

        // Apply in-memory In-Stock filter
        if (inStockOnly) {
          prods = prods.filter((p) => p.stock > 0);
        }

        setProducts(prods);
      }
    } catch (err) {
      console.error('[Catalog Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, searchParam, sortBy, selectedPriceRange, inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  }, [searchInput, searchParams, setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedPriceRange(0);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchInput('');
    setSearchParams({});
  }, [setSearchParams]);

  const handleCategoryChange = useCallback((catId) => {
    const newCat = selectedCategory === catId ? '' : catId;
    setSelectedCategory(newCat);
    const newParams = new URLSearchParams(searchParams);
    if (newCat) {
      const catObj = categories.find((c) => c._id === newCat);
      if (catObj) newParams.set('category', catObj.name);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  }, [selectedCategory, searchParams, categories, setSearchParams]);

  const handleBrandChange = useCallback((brandId) => {
    const newBrand = selectedBrand === brandId ? '' : brandId;
    setSelectedBrand(newBrand);
    const newParams = new URLSearchParams(searchParams);
    if (newBrand) {
      const brandObj = brands.find((b) => b._id === newBrand);
      if (brandObj) newParams.set('brand', brandObj.name);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams);
  }, [selectedBrand, searchParams, brands, setSearchParams]);

  const sortOptions = [
    { id: 'featured', label: t('catalog.sort_featured') },
    { id: 'price_asc', label: t('catalog.sort_price_asc') },
    { id: 'price_desc', label: t('catalog.sort_price_desc') },
    { id: 'rating', label: t('catalog.sort_rating') }
  ];

  const currentSortLabel = sortOptions.find((s) => s.id === sortBy)?.label || t('catalog.sort_featured');

  const activeFiltersCount = useMemo(
    () =>
      (selectedCategory ? 1 : 0) +
      (selectedBrand ? 1 : 0) +
      (selectedPriceRange > 0 ? 1 : 0) +
      (inStockOnly ? 1 : 0) +
      (searchParam ? 1 : 0),
    [selectedCategory, selectedBrand, selectedPriceRange, inStockOnly, searchParam]
  );

  return (
    <div className="catalog-editorial-page page-enter">
      <div className="container">
        {/* Editorial Breadcrumb */}
        <div className="catalog-breadcrumb">
          <Link to="/">{t('catalog.breadcrumb_home')}</Link>
          <span className="crumb-sep">/</span>
          <span className="current-crumb">{t('catalog.breadcrumb_catalog')}</span>
        </div>

        {/* Page Header */}
        <div className="catalog-editorial-header">
          <div className="header-left-col">
            <span className="catalog-eyebrow">MINISHOP / HARDWARE VAULT</span>
            <h1 className="catalog-main-title">
              {categoryParam
                ? `${categoryParam}`
                : searchParam
                ? `"${searchParam}"`
                : t('catalog.title')}
            </h1>
            <p className="catalog-main-desc">
              {t('catalog.desc')}
            </p>
          </div>

          <div className="catalog-header-meta">
            <span className="catalog-count-badge">
              <strong>{products.length}</strong> {t('catalog.count_products', { count: products.length })}
            </span>
          </div>
        </div>

        {/* Quick Category Navigation Pill Bar */}
        <div className="catalog-quick-nav-pills">
          <button
            className={`quick-pill-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            <Layers size={15} />
            <span>{t('catalog.all_categories')}</span>
          </button>
          {categories.map((cat) => {
            const IconComp = categoryIcons[cat.name] || Tag;
            return (
              <button
                key={cat._id}
                className={`quick-pill-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat._id)}
              >
                <IconComp size={15} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Catalog Main Layout */}
        <div className="catalog-layout">
          {/* Mobile Filter & Sort Bar */}
          <div className="mobile-filter-bar">
            <button
              className="btn-secondary mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <Filter size={16} />
              <span>{t('catalog.filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Custom Mobile Sort Dropdown */}
            <div className="custom-sort-dropdown-container" ref={mobileSortRef}>
              <button
                className="custom-sort-trigger-capsule"
                onClick={() => setMobileSortOpen(!mobileSortOpen)}
              >
                <ArrowUpDown size={14} className="sort-icon-blue" />
                <span className="sort-trigger-label">{currentSortLabel}</span>
                <ChevronDown size={13} className={`sort-chevron-icon ${mobileSortOpen ? 'rotate' : ''}`} />
              </button>

              {mobileSortOpen && (
                <div className="custom-sort-menu-popover card">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      className={`sort-menu-item ${sortBy === opt.id ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(opt.id);
                        setMobileSortOpen(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check size={15} className="sort-check-active" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Left Filter Sidebar */}
          <aside className={`catalog-sidebar card ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <h3>{t('catalog.filters')}</h3>
              {activeFiltersCount > 0 && (
                <button className="reset-sidebar-btn" onClick={handleResetFilters}>
                  {t('catalog.reset_all')}
                </button>
              )}
            </div>

            {/* 1. Search Box */}
            <div className="filter-group">
              <label className="filter-group-title">{t('catalog.search_label', 'Qidirish')}</label>
              <form onSubmit={handleSearchSubmit} className="sidebar-search-box">
                <input
                  type="text"
                  placeholder={t('catalog.search_input')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <Search size={14} />
                </button>
              </form>
            </div>

            {/* 2. Categories Facet */}
            <div className="filter-group">
              <label className="filter-group-title">{t('catalog.category')}</label>
              <div className="facet-list">
                <button
                  className={`facet-pill-btn ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  <span>{t('catalog.all_categories')}</span>
                  {selectedCategory === '' && <Check size={14} className="facet-check" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className={`facet-pill-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat._id)}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat._id && <Check size={14} className="facet-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Brands Facet */}
            {brands.length > 0 && (
              <div className="filter-group">
                <label className="filter-group-title">{t('catalog.brands')}</label>
                <div className="facet-list">
                  <button
                    className={`facet-pill-btn ${selectedBrand === '' ? 'active' : ''}`}
                    onClick={() => handleBrandChange('')}
                  >
                    <span>{t('catalog.all_brands', 'Barcha brendlar')}</span>
                    {selectedBrand === '' && <Check size={14} className="facet-check" />}
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b._id}
                      className={`facet-pill-btn ${selectedBrand === b._id ? 'active' : ''}`}
                      onClick={() => handleBrandChange(b._id)}
                    >
                      <span>{b.name}</span>
                      {selectedBrand === b._id && <Check size={14} className="facet-check" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Price Ranges Facet */}
            <div className="filter-group">
              <label className="filter-group-title">{t('catalog.price_range')}</label>
              <div className="facet-list">
                {priceRanges.map((range, idx) => (
                  <button
                    key={idx}
                    className={`facet-pill-btn ${selectedPriceRange === idx ? 'active' : ''}`}
                    onClick={() => setSelectedPriceRange(idx)}
                  >
                    <span>{range.defaultLabel}</span>
                    {selectedPriceRange === idx && <Check size={14} className="facet-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. In-Stock Only Checkbox */}
            <div className="filter-group in-stock-group">
              <label className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">{t('catalog.in_stock_only')}</span>
              </label>
            </div>

            {mobileFilterOpen && (
              <button
                className="btn-primary apply-mobile-filters-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                {t('catalog.apply_filters')} ({products.length})
              </button>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <main className="catalog-content-pane">
            {/* Desktop Top Bar */}
            <div className="catalog-top-controls">
              <div className="active-chips-container">
                {activeFiltersCount > 0 ? (
                  <>
                    <span className="chips-title">{t('catalog.active_filters')}</span>
                    {searchParam && (
                      <span className="active-filter-chip">
                        "{searchParam}"
                        <button onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          p.delete('search');
                          setSearchParams(p);
                        }}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="active-filter-chip">
                        {categories.find((c) => c._id === selectedCategory)?.name}
                        <button onClick={() => handleCategoryChange('')}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedBrand && (
                      <span className="active-filter-chip">
                        {brands.find((b) => b._id === selectedBrand)?.name}
                        <button onClick={() => handleBrandChange('')}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedPriceRange > 0 && (
                      <span className="active-filter-chip">
                        {priceRanges[selectedPriceRange].defaultLabel}
                        <button onClick={() => setSelectedPriceRange(0)}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {inStockOnly && (
                      <span className="active-filter-chip">
                        {t('catalog.in_stock_only')}
                        <button onClick={() => setInStockOnly(false)}>
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    <button className="clear-all-chips-btn" onClick={handleResetFilters}>
                      {t('catalog.clear_all')}
                    </button>
                  </>
                ) : (
                  <span className="showing-results-text">
                    <strong>{products.length}</strong> {t('catalog.count_products', { count: products.length })}
                  </span>
                )}
              </div>

              {/* Custom Desktop Sort Dropdown Popover */}
              <div className="custom-sort-dropdown-container" ref={desktopSortRef}>
                <button
                  className="custom-sort-trigger-capsule"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  <ArrowUpDown size={14} className="sort-icon-blue" />
                  <span className="sort-trigger-label">{t('catalog.sort_by')}: {currentSortLabel}</span>
                  <ChevronDown size={13} className={`sort-chevron-icon ${sortDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {sortDropdownOpen && (
                  <div className="custom-sort-menu-popover card">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        className={`sort-menu-item ${sortBy === opt.id ? 'active' : ''}`}
                        onClick={() => {
                          setSortBy(opt.id);
                          setSortDropdownOpen(false);
                        }}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check size={15} className="sort-check-active" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="catalog-products-grid">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="product-skeleton card">
                    <div className="skeleton-img"></div>
                    <div className="skeleton-line full"></div>
                    <div className="skeleton-line half"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="catalog-empty-card card">
                <img src="/images/empty_cart.png" alt="No items" className="empty-catalog-img" />
                <h3>{t('catalog.empty_title')}</h3>
                <p>{t('catalog.empty_desc')}</p>
                <button className="btn-primary" onClick={handleResetFilters}>
                  {t('catalog.reset_all')}
                </button>
              </div>
            ) : (
              <div className="catalog-products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
