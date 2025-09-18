import { useState, useEffect } from "react";
import axios from "axios";
import '../css/Restaurants.css';
import Loading from "./Loading";
import {FaMapMarkerAlt, FaPhone, FaEnvelope, FaRegStar } from 'react-icons/fa';
import RestaurantImage from "./RestaurantImage";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('https://rikoapi.onrender.com/api/restaurant/restaurants')
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the restaurant data!", error);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleAddRestaurant = () => {
        window.location.href = '/restaurantes/addrestaurante';
    };

    const handleRestaurantClick = (id) => {
        window.location.href = `/restaurantes/${id}`;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (!restaurants) return <div><Loading/></div>;

    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="restaurants-container">
            <h1>Lista de Restaurantes</h1>
            <input 
                type="text" 
                placeholder="Buscar restaurante..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            <div className="restaurants-list">
                {filteredRestaurants.map((restaurant, index) => (
                    <div onClick={() => handleRestaurantClick(restaurant._id)} key={index} className="restaurant-card">
                        <RestaurantImage restaurant={restaurant} />
                        <div className="restaurant-info">
                            <h2 style={{ cursor: 'pointer', textAlign: 'left' }}>{restaurant.nombre}</h2>
                            <p><FaPhone />  {restaurant.telefono}</p>
                            <p> <FaEnvelope />  {restaurant.email}</p>
                            <p> <FaMapMarkerAlt /> {restaurant.ubicacion}</p>
                            <p> <FaRegStar /> {restaurant.calificacion.promedio}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="add-restaurant-button" onClick={handleAddRestaurant}>+</button>
        </div>
    );
};

export default Restaurants;
