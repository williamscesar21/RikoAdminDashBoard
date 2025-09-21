import { useState, useEffect } from "react";
import axios from "axios";
import '../css/Restaurants.css';
import Loading from "./Loading";
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
                console.error("Error fetching restaurant data:", error);
            });
    }, []);

    const handleAddRestaurant = () => {
        window.location.href = '/restaurantes/addrestaurante';
    };

    const handleRestaurantClick = (id) => {
        window.location.href = `/restaurantes/${id}`;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (!restaurants) return <Loading />;

    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="restaurants-container">
            <h1>Restaurantes</h1>
            <input 
                type="text" 
                placeholder="Buscar restaurante..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            <div className="restaurants-list">
                {filteredRestaurants.map((restaurant) => (
                    <div 
                        key={restaurant._id} 
                        onClick={() => handleRestaurantClick(restaurant._id)} 
                        className="restaurant-card"
                    >
                        <RestaurantImage restaurant={restaurant} />
                        <h2>{restaurant.nombre}</h2>
                    </div>
                ))}
            </div>
            <button className="add-restaurant-button" onClick={handleAddRestaurant}>+</button>
        </div>
    );
};

export default Restaurants;
