import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axios from 'axios';

const Home = () => {
  const [time, setTime] = useState(new Date());
  const [counts, setCounts] = useState({
    restaurants: 0,
    clients: 0,
    products: 0,
    repartidores: 0,
    wallets: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, clientsRes, productsRes, repartidoresRes, walletsRes] = await Promise.all([
          axios.get('https://rikoapi.onrender.com/api/restaurant/restaurants'),
          axios.get('https://rikoapi.onrender.com/api/client/client-obtener'),
          axios.get('https://rikoapi.onrender.com/api/product/product'),
          axios.get('https://rikoapi.onrender.com/api/repartidor/repartidor'),
          axios.get('https://rikoapi.onrender.com/api/wallets/wallets'),
        ]);

        setCounts({
          restaurants: restaurantRes.data.length,
          clients: clientsRes.data.length,
          products: productsRes.data.length,
          repartidores: repartidoresRes.data.length,
          wallets: walletsRes.data.length,
        });
      } catch (error) {
        console.error('There was an error fetching data!', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const boardItems = [
    { label: 'Restaurantes', count: counts.restaurants },
    { label: 'Repartidores', count: counts.repartidores },
    { label: 'Productos', count: counts.products },
    { label: 'Clientes', count: counts.clients },
    { label: 'Billeteras', count: counts.wallets },
    { label: 'Comisiones', count: '221.09$' },
    { label: 'Ingresos', count: '546.89$' },
  ];

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>{getGreeting()}, ¡Bienvenido al Dashboard de Riko!</h1>
        <p>Nos alegra verte de nuevo. Aquí puedes gestionar toda la información de la plataforma.</p>
      </div>
      <div className="clock-section">
        <div className="clock">
          {time.toLocaleTimeString()}
        </div>
      </div>
      <div className="info-section">
        {boardItems.map((item, index) => (
          <div className="board" key={index}>
            <h3>{item.label}</h3>
            <p>{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
