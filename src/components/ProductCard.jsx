import React from 'react';
import '../css/Products.css';

const ProductCard = ({ product, restaurantName }) => {
    const handleGoToProduct = (id) => {
        window.location.href = `/productos/${id}`;
    }

    return (
        <div onClick={() => handleGoToProduct(product._id)} className="product-card">
            {product.images.length > 0 && (
                <img src={product.images[0]} alt={product.nombre} className="product-image" />
            )}
            <h2>{product.nombre}</h2>
            <p className="product-id">ID: {product._id}</p>
            <p className="product-description">{product.descripcion}</p>
            <p className="product-id">Restaurante: 
                <a href={`/restaurantes/${product.id_restaurant}`}>
                    {restaurantName}
                </a>
            </p>
            <p className="product-price">${product.precio.toFixed(2)}</p>
            <div className="product-tags">
                {product.tags.map((tag, index) => (
                    <span key={index} className="product-tag">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default ProductCard;
