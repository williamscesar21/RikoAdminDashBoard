import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../css/Navbar.css';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [activeList, setActiveList] = useState(null);
  const [username, setUsername] = useState(Cookies.get('username') || 'Usuario');
  const location = useLocation();

  const paths = [
    { name: "Inicio", path: "/" },
    { name: "Admins", path: "/admins" },
    { name: "Clientes", path: "/clientes" },
    { name: "Restaurantes", path: "/restaurantes" },
    { name: "Repartidores", path: "/repartidores" },
    { name: "Productos", path: "/productos" },
    { name: "Billeteras", path: "/wallets" },
    { name: "Pedidos", path: "/pedidos" }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const index = paths.findIndex(item => item.path === currentPath);
    
    if (index !== -1) {
      setActiveList(index);
      Cookies.set('activeList', index);
    } else {
      const savedIndex = Cookies.get('activeList');
      if (savedIndex) {
        setActiveList(parseInt(savedIndex, 10));
      }
    }
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    window.location.reload();
  };

  const handleItemClick = (index) => {
    setActiveList(index);
    Cookies.set('activeList', index);
  };

  return (
    <div className="navbar">
      <div className="header">
        <img onClick={() => window.location.href="/"} src="/logoNaranja.png" alt="Logo" className="logo" />
        <p className="username">{username}</p>
      </div>
      <div className="contentNav">
        <ul>
          {paths.map((item, index) => (
            <Link className="link" to={item.path} key={index} onClick={() => handleItemClick(index)}>
              <li className={activeList === index ? 'active' : ''}>
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="footer">
        <button className="logout" onClick={handleLogout}>Cerrar sesión</button>
        <p>&copy; Riko 2024</p>
        <p className="rights">Todos los derechos reservados</p>
      </div>
    </div>
  );
};

export default Navbar;
