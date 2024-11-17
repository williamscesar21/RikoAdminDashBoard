import AdminLog from './components/AdminLog';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Admins from './components/Admins';
import Restaurants from './components/Restaurants';
import AddRestaurant from './components/AddRestaurant';
import Clients from './components/Clients';
import AddClient from './components/AddClient';
import RestaurantScreen from './components/RestaurantScreen';
import ClientScreen from './components/ClientScreen';
import Repartidores from './components/Repartidores';
import Products from './components/Products';
import AddProduct from './components/AddProduct';
import ProductScreen from './components/ProductScreen';
import AddRepartidor from './components/AddRepartidor';
import RepartidorScreen from './components/RepartidorScreen';
import Wallets from './components/Wallets';
import WalletScreen from './components/WalletScreen';
import AddFunds from './components/AddFunds';
import TransferFunds from './components/TransferFunds';
import PaymentVerification from './components/PaymentVerification';

function App() {
  const token = Cookies.get('token');

  return (
    <BrowserRouter>
      {token ? (
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path='/admins' element={<Admins/>}/>
              <Route path='/restaurantes' element={<Restaurants/>}/>
              <Route path='/productos' element={<Products/>}/>
              <Route path='/productos/:id' element={<ProductScreen/>}/>
              <Route path='/restaurantes/:id' element={<RestaurantScreen/>}/>
              <Route path='/clientes/:id' element={<ClientScreen/>}/>
              <Route path='/restaurantes/addrestaurante' element={<AddRestaurant/>}/>
              <Route path='/repartidores/addrepartidor' element={<AddRepartidor/>}/>
              <Route path='/repartidores/repartidor/:id' element={<RepartidorScreen/>}/>
              <Route path='/wallets/:user/:userType' element={<WalletScreen/>}/>
              <Route path='/wallets/addfunds' element={<AddFunds/>}/>
              <Route path='/wallets/transfer' element={<TransferFunds/>}/>
              <Route path='/productos/addproducto' element={<AddProduct/>}/>
              <Route path='/clientes' element={<Clients/>}/>
              <Route path='/repartidores' element={<Repartidores/>}/>
              <Route path='/clientes/addcliente' element={<AddClient/>}/>
              <Route path='/wallets' element={<Wallets/>}/>
              <Route path='/paymentv' element={<PaymentVerification/>}/>
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<AdminLog />} />
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
