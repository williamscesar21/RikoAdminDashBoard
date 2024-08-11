import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Products.css';
import Loading from './Loading';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurantNames, setRestaurantNames] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Obtener todos los productos
        axios.get('https://rikoapi.onrender.com/api/product/product')
            .then(response => {
                setProducts(response.data);

                // Obtener nombres de restaurantes para cada producto
                const restaurantIds = [...new Set(response.data.map(product => product.id_restaurant))];
                
                const fetchRestaurantNames = async () => {
                    try {
                        const requests = restaurantIds.map(id => 
                            axios.get(`https://rikoapi.onrender.com/api/restaurant/restaurant/${id}`)
                        );
                        const responses = await Promise.all(requests);
                        const names = responses.reduce((acc, response) => {
                            acc[response.data._id] = response.data.nombre;
                            return acc;
                        }, {});
                        setRestaurantNames(names);
                    } catch (error) {
                        console.error('Error fetching restaurant names:', error);
                    }
                };

                fetchRestaurantNames();
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product._id.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtrado por ID
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurantNames[product.id_restaurant]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading />;

    return (
        <div className="productos-container">
            <h1>Productos</h1>
            <input 
                type="text" 
                placeholder="Buscar producto por ID, nombre, descripción o restaurante..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            <div className="productos-list">
                {filteredProducts.map(product => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        restaurantName={restaurantNames[product.id_restaurant] || 'Cargando...'} 
                    />
                ))}
            </div>
            <Link to="/productos/addproducto" className="add-product-button">+</Link>
        </div>
    );
};

export default Products;
