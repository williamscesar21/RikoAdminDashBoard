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
            <p className="product-price">${product.precio.toFixed(2)}</p>
        </div>
    );
};

export default ProductCard;
