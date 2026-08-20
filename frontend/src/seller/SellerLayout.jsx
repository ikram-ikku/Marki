import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader.jsx';
import SellerSidebar from './SellerSidebar.jsx';
import '../css/seller.css';

export default function SellerLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="seller-shell">
      {/* Mobile Overlay */}
      <div 
        className={`seller-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={closeSidebar}
      />

      <SellerSidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      
      <div className="seller-main-area">
        <SellerHeader 
          user={user} 
          onLogout={onLogout} 
          onMenuToggle={toggleSidebar} 
        />
        <main className="seller-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
