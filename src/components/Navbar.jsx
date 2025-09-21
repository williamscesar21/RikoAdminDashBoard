import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../css/Navbar.css';
import Cookies from 'js-cookie';
import {
  FaHome, FaUserShield, FaUsers, FaStore, FaMotorcycle,
  FaBoxOpen, FaWallet, FaShoppingBag, FaBars, FaTimes
} from 'react-icons/fa';

const Navbar = () => {
  const [activeList, setActiveList] = useState(null);
  const [username, setUsername] = useState(Cookies.get('username') || 'Usuario');
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // abierto en desktop, cerrado en mobile
  const location = useLocation();

  const paths = [
    { name: "Inicio", path: "/", icon: <FaHome /> },
    { name: "Admins", path: "/admins", icon: <FaUserShield /> },
    { name: "Clientes", path: "/clientes", icon: <FaUsers /> },
    { name: "Restaurantes", path: "/restaurantes", icon: <FaStore /> },
    { name: "Repartidores", path: "/repartidores", icon: <FaMotorcycle /> },
    { name: "Productos", path: "/productos", icon: <FaBoxOpen /> },
    { name: "Billeteras", path: "/wallets", icon: <FaWallet /> },
    { name: "Pedidos", path: "/pedidos", icon: <FaShoppingBag /> }
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

  // Ajustar estado si cambia el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);  // en desktop se abre
      } else {
        setIsOpen(false); // en mobile se cierra
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    window.location.reload();
  };

  const handleItemClick = (index) => {
    setActiveList(index);
    Cookies.set('activeList', index);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay en mobile */}
      <div
        className={`navbar-overlay ${isOpen && window.innerWidth < 768 ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`navbar ${isOpen ? 'open' : 'closed'}`}>
        <div className="header">
          {isOpen &&
          <img
            onClick={() => window.location.href="/"}
            src="/logoNaranja.png"
            alt="Logo"
            className="logo"
            style={{ width: isOpen ? '100px' : '50px' }}
          />}
          {isOpen && <p className="username">{username}</p>}
        </div>

        <div className="contentNav">
          <ul>
            {paths.map((item, index) => (
              <Link
                className="link"
                to={item.path}
                key={index}
                onClick={() => handleItemClick(index)}
              >
                <li className={activeList === index ? 'active' : ''}>
                  <span className="icon" style={{ marginRight: isOpen ? '10px' : '0' }}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="text">{item.name}</span>}
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <div className="footer">
          {isOpen && (
            <>
              <button className="logout" onClick={handleLogout}>Cerrar sesión</button>
              <p>&copy; Riko 2024</p>
              <p className="rights">Todos los derechos reservados</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
