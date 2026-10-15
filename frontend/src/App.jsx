import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Core Shell Components (eagerly loaded for shell layout)
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import PageSkeleton from './components/PageSkeleton/PageSkeleton';

// Code-split / Lazy-loaded Public Pages
const Home = lazy(() => import('./pages/Home/Home'));
const Catalog = lazy(() => import('./pages/Catalog/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const CustomerOrders = lazy(() => import('./pages/Orders/Orders'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));

// Code-split Admin Layout & Sub-Pages (Admin bundle + Recharts isolated from customers)
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'));
const Products = lazy(() => import('./pages/Admin/Products/Products'));
const Categories = lazy(() => import('./pages/Admin/Categories/Categories'));
const Brands = lazy(() => import('./pages/Admin/Brands/Brands'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders/Orders'));
const Users = lazy(() => import('./pages/Admin/Users/Users'));
const Coupons = lazy(() => import('./pages/Admin/Coupons/Coupons'));
const Reviews = lazy(() => import('./pages/Admin/Reviews/Reviews'));
const Payments = lazy(() => import('./pages/Admin/Payments/Payments'));
const Notifications = lazy(() => import('./pages/Admin/Notifications/Notifications'));

import './App.css';

// Layout with Public Header & Footer
const PublicLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Router>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    {/* Public & Customer Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/catalog" element={<Catalog />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <CustomerOrders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="*" element={<Home />} />
                    </Route>

                    {/* Admin Routes with Isolated Bundle */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminLayout />
                        </AdminRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="products" element={<Products />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="brands" element={<Brands />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="users" element={<Users />} />
                      <Route path="coupons" element={<Coupons />} />
                      <Route path="reviews" element={<Reviews />} />
                      <Route path="payments" element={<Payments />} />
                      <Route path="notifications" element={<Notifications />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
