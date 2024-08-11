import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axios from 'axios';

const Home = () => {
  const [time, setTime] = useState(new Date());
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [repartidoresCount, setRepartidoresCount] = useState(0);

  useEffect(() => {
    axios.get('https://rikoapi.onrender.com/api/restaurant/restaurants')
      .then(response => {
        setRestaurantCount(response.data.length); // Assuming the response is an array of restaurants
      })
      .catch(error => {
        console.error("There was an error fetching the restaurant data!", error);
      });
  }, []);

  useEffect(() => {
    axios.get('https://rikoapi.onrender.com/api/client/client-obtener')
      .then(response => {
        setClientsCount(response.data.length); // Assuming the response is an array of clients
      })
      .catch(error => {
        console.error("There was an error fetching the clients data!", error);
      });
  }, []);
  
  useEffect(() => {
    axios.get('https://rikoapi.onrender.com/api/product/product')
      .then(response => {
        setProductsCount(response.data.length); // Assuming the response is an array of clients
      })
      .catch(error => {
        console.error("There was an error fetching the clients data!", error);
      });
  }, []);
  
  useEffect(() => {
    axios.get('https://rikoapi.onrender.com/api/repartidor/repartidor')
      .then(response => {
        setRepartidoresCount(response.data.length); // Assuming the response is an array of clients
      })
      .catch(error => {
        console.error("There was an error fetching the clients data!", error);
      });
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
        <div className="board">
          <h3>Restaurantes</h3>
          <p>{restaurantCount}</p>
        </div>
        <div className="board">
          <h3>Repartidores</h3>
          <p>{repartidoresCount}</p>
        </div>
        <div className="board">
          <h3>Productos</h3>
          <p>{productsCount}</p>
        </div>
        <div className="board">
          <h3>Clientes</h3>
          <p>{clientsCount}</p>
        </div>
        <div className="board">
          <h3>Billeteras</h3>
          <p>200</p>
        </div>
        <div className="board">
          <h3>Comisiones</h3>
          <p>221.09$</p>
        </div>
        <div className="board">
          <h3>Ingresos</h3>
          <p>546.89$</p>
        </div>
        {/* Añade más tarjetas si es necesario */}
      </div>
    </div>
  );
};

export default Home;
