import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SellerLayout from './SellerLayout.jsx';
import SellerDashboard from './SellerDashboard.jsx';
import SellerProducts from './SellerProducts.jsx';
import AddProduct from './AddProduct.jsx';
import EditProduct from './EditProduct.jsx';
import SellerOrders from './SellerOrders.jsx';
import SellerProfile from './SellerProfile.jsx';
import SellerSettings from './SellerSettings.jsx';

export default function SellerPortal() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Routes>
      <Route element={<SellerLayout user={user} onLogout={handleLogout} />}>
        <Route path="dashboard" element={<SellerDashboard token={token} navigate={navigate} />} />
        <Route path="products" element={<SellerProducts token={token} navigate={navigate} />} />
        <Route path="products/add" element={<AddProduct token={token} navigate={navigate} />} />
        <Route path="products/:id/edit" element={<EditProductWrapper token={token} navigate={navigate} />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="profile" element={<SellerProfile />} />
        <Route path="settings" element={<SellerSettings />} />
      </Route>
    </Routes>
  );
}

import { useParams } from 'react-router-dom';
function EditProductWrapper({ token, navigate }) {
  const { id } = useParams();
  return <EditProduct token={token} productId={id} navigate={navigate} />;
}
