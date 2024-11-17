import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client'; // Importa Socket.IO
import '../css/Products.css';
import Loading from './Loading';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const socket = io('https://rikoapi.onrender.com'); // Conéctate al servidor

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurantNames, setRestaurantNames] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    // Función para obtener todos los productos
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('https://rikoapi.onrender.com/api/product/product');
            setProducts(data);

            // Obtener los nombres de los restaurantes asociados
            const restaurantIds = [...new Set(data.map(product => product.id_restaurant))];
            if (restaurantIds.length > 0) {
                const requests = restaurantIds.map(id =>
                    axios.get(`https://rikoapi.onrender.com/api/restaurant/restaurant/${id}`)
                );
                const responses = await Promise.all(requests);
                const names = responses.reduce((acc, response) => {
                    acc[response.data._id] = response.data.nombre;
                    return acc;
                }, {});
                setRestaurantNames(names);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Llama a fetchProducts inmediatamente

        // Establecer un intervalo para actualizar los productos cada 0.5 segundos
        const intervalId = setInterval(fetchProducts, 500); 

        // Función para manejar los cambios en tiempo real de productos
        const handleRealTimeUpdates = (change) => {
            console.log('Producto actualizado:', change);
            if (change.operationType === 'insert') {
                setProducts((prevProducts) => [...prevProducts, change.fullDocument]);
            } else if (change.operationType === 'update') {
                setProducts((prevProducts) =>
                    prevProducts.map(product =>
                        product._id === change.documentKey._id
                            ? { ...product, ...change.updateDescription.updatedFields }
                            : product
                    )
                );
            } else if (change.operationType === 'delete') {
                setProducts((prevProducts) =>
                    prevProducts.filter(product => product._id !== change.documentKey._id)
                );
            }
        };

        // Escucha los cambios en tiempo real de productos
        socket.on('productoActualizado', handleRealTimeUpdates);

        // Limpiar la suscripción del socket y el intervalo al desmontar el componente
        return () => {
            socket.off('productoActualizado', handleRealTimeUpdates);
            clearInterval(intervalId); // Limpia el intervalo
        };
    }, []);

    // Manejador para la barra de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtrar productos según el término de búsqueda
    const filteredProducts = products.filter((product) =>
        product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurantNames[product.id_restaurant]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mostrar el componente Loading mientras se cargan los productos
    if (loading) return <Loading />;

    return (
        <div className="productos-container">
            <h1>Productos</h1>
            {/* Barra de búsqueda */}
            <input 
                type="text" 
                placeholder="Buscar producto por ID, nombre, descripción o restaurante..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            {/* Lista de productos */}
            <div className="productos-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            restaurantName={restaurantNames[product.id_restaurant] || 'Cargando...'} 
                        />
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>
            {/* Botón para agregar productos */}
            <Link to="/productos/addproducto" className="add-product-button">+</Link>
        </div>
    );
};

export default Products;
