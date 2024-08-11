import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ProductScreen.css';
import Loading from './Loading';
import { FaPencil, FaCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import Notificacion from './Notificacion';

const ProductScreen = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        tags: [],
    });
    const availableTags = ['Desayuno', 'Almuerzo', 'Cena', 'Bebida', 'Postre', 'Comida Rapida', 'Comida Gourmet', 'Nutricional'];

    const [notification, setNotification] = useState({
        visible: false,
        mensaje: '',
        tipo: ''
    });

    useEffect(() => {
        axios.get(`https://rikoapi.onrender.com/api/product/product/${id}`)
            .then(response => {
                setProduct(response.data);
                setSelectedImage(response.data.images[0]);
                setEditableFields({
                    nombre: response.data.nombre,
                    descripcion: response.data.descripcion,
                    precio: response.data.precio,
                    tags: response.data.tags,
                });
                return axios.get(`https://rikoapi.onrender.com/api/restaurant/restaurant/${response.data.id_restaurant}`);
            })
            .then(response => {
                setRestaurantName(response.data.nombre);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                setLoading(false);
            });
    }, [id]);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditableFields(prevFields => ({
            ...prevFields,
            [name]: value
        }));
    };

    const handleTagChange = (tag) => {
        setEditableFields(prevFields => {
            const tagExists = prevFields.tags.includes(tag);
            let newTags;

            if (tagExists) {
                newTags = prevFields.tags.filter(t => t !== tag);
            } else {
                if (prevFields.tags.length >= 3) {
                    return prevFields;
                }
                newTags = [...prevFields.tags, tag];
            }

            return { ...prevFields, tags: newTags };
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditableFields({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            tags: product.tags,
        });
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setNotification({
            visible: true,
            mensaje: 'Procesando cambios...',
            tipo: 'procesando'
        });
        axios.put(`https://rikoapi.onrender.com/api/product/product/${id}`, editableFields)
            .then(response => {
                setProduct(prevState => ({ ...prevState, ...editableFields }));
                setNotification({
                    visible: true,
                    mensaje: 'Cambios guardados',
                    tipo: 'exitoso'
                });
                setTimeout(() => {
                    setNotification({
                        visible: false,
                        mensaje: '',
                        tipo: ''
                    });
                }, 3000);
            })
            .catch(error => {
                console.error('Error saving product details:', error);
                setNotification({
                    visible: true,
                    mensaje: 'Error al guardar los cambios',
                    tipo: 'error'
                });
            });
    };

    if (loading) return <Loading />;

    if (!product) return <div>Producto no encontrado</div>;

    return (
        <div className="product-screen-container">
            {notification.visible ? <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} /> : <></>}
            <h1>
                {isEditing ? (
                    <input
                        className="product-title"
                        type="text"
                        name="nombre"
                        value={editableFields.nombre}
                        onChange={handleFieldChange}
                    />
                ) : (
                    product.nombre
                )}
            </h1>
            <div className="product-details">
                <div className="product-images-container">
                    <div className="product-thumbnails">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Miniatura ${index}`}
                                className={`thumbnail-image ${selectedImage === image ? 'selected' : ''}`}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                    <div className="product-main-image">
                        <img src={selectedImage} alt="Imagen seleccionada" className="main-image" />
                    </div>
                </div>
                <div className="product-info">
                    <p><strong>Descripción:</strong>
                        {isEditing ? (
                            <textarea
                                name="descripcion"
                                value={editableFields.descripcion}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            product.descripcion
                        )}
                    </p>
                    <p><strong>Precio:</strong>
                        {isEditing ? (
                            <input
                                className="product-price"
                                type="number"
                                name="precio"
                                value={editableFields.precio}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            `$${product.precio}`
                        )}
                    </p>
                    <p><strong>Restaurante:</strong> <a href={`/restaurantes/${product.id_restaurant}`}>{restaurantName}</a></p>
                    <div className="product-tags">
                        <strong>Tags:</strong>
                        {isEditing ? (
                            <div className="tags-container">
                                {availableTags.map((tag, index) => (
                                    <label
                                        key={index}
                                        className={`tag-item ${editableFields.tags.includes(tag) ? 'selected' : ''}`}
                                        onClick={() => handleTagChange(tag)}
                                    >
                                        <input
                                            type="checkbox"
                                            value={tag}
                                            onChange={() => handleTagChange(tag)}
                                            checked={editableFields.tags.includes(tag)}
                                        />
                                        {tag}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            product.tags.map((tag, index) => (
                                <span key={index} className="product-tag">{tag}</span>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="edit-product-buttons">
                {isEditing ? (
                    <>
                        <button className="cancel-edit-product-button" onClick={handleCancelEdit}><FaTimesCircle /></button>
                        <button className="save-edit-product-button" onClick={handleSaveClick}><FaCheck /></button>
                    </>
                ) : (
                    <button className="edit-product-button" onClick={handleEditClick}><FaPencil /></button>
                )}
            </div>
        </div>
    );
};

export default ProductScreen;
