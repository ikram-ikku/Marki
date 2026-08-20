import { Routes, Route } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SellerPortal from './seller/SellerPortal';
import UtilityBar from './components/UtilityBar';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ShopHero from './components/ShopHero';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import MobileFilterModal from './components/MobileFilterModal';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import Toast from './components/Toast';
import Footer from './components/Footer';
import './css/shop.css';

function MainContent() {
  const { currentView } = useShop();

  return (
    <>
      <UtilityBar />
      <Header />

      <main style={{ minHeight: '80vh' }}>
        {currentView === 'shop' ? (
          <div className="shop-page">
            <div className="shop-container">
              <ShopHero />
              <FilterBar />
              <ProductGrid />
            </div>
          </div>
        ) : (
          <>
            <Hero />
            <Services />
          </>
        )}
      </main>

      {/* Global Drawers & Modals */}
      <QuickViewModal />
      <CartDrawer />
      <WishlistDrawer />
      <MobileFilterModal />
      <Toast />

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/seller/*" element={
        <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
          <SellerPortal />
        </ProtectedRoute>
      } />
      <Route path="/*" element={
        <ShopProvider>
          <MainContent />
        </ShopProvider>
      } />
    </Routes>
  );
}
