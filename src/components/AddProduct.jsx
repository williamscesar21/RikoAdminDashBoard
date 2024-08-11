import { useState, useEffect } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
import '../css/AddProduct.css';
import Notificacion from "./Notificacion";

const AddProduct = () => {
    const [productData, setProductData] = useState({
        nombre: "",
        precio: "",
        descripcion: "",
        calificacion: { calificaciones: [], promedio: 0 },
        id_restaurant: "",
        tags: [],
        images: []
    });

    const [restaurants, setRestaurants] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const availableTags = ['Desayuno', 'Almuerzo', 'Cena', 'Bebida', 'Postre', 'Comida Rapida', 'Comida Gourmet', 'Nutricional'];
    const [notification, setNotification] = useState({ visible: false, mensaje: '', tipo: '' });

    useEffect(() => {
        axios.get('https://rikoapi.onrender.com/api/restaurant/restaurants')
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the restaurants!", error);
                alert("Error al obtener los restaurantes. Inténtelo de nuevo.");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleImageChange = (files) => {
        if (files.length > 3) {
            alert("Solo se pueden agregar hasta 3 imágenes.");
            return;
        }

        const fileArray = Array.from(files);
        const newImageFiles = fileArray.filter(file => !imageFiles.some(existingFile => existingFile.name === file.name));

        if (newImageFiles.length + imageFiles.length > 3) {
            alert("No se pueden agregar más de 3 imágenes.");
            return;
        }

        setImageFiles(prevFiles => [...prevFiles, ...newImageFiles]);

        const previewUrls = newImageFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...previewUrls]);
    };

    const handleTagChange = (tag) => {
        setProductData(prevData => {
            const tagExists = prevData.tags.includes(tag);
            let newTags;
            
            if (tagExists) {
                newTags = prevData.tags.filter(t => t !== tag);
            } else {
                if (prevData.tags.length >= 3) {
                    return prevData;
                }
                newTags = [...prevData.tags, tag];
            }

            return { ...prevData, tags: newTags };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({
            visible: true,
            mensaje: 'Creando producto...',
            tipo: 'procesando'
        });

        const imageUrls = await Promise.all(
            imageFiles.map(async (file) => {
                const storageRef = ref(storage, `products/${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            })
        );

        axios.post('https://rikoapi.onrender.com/api/product/product', { ...productData, images: imageUrls })
            .then(response => {
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
                window.location.reload();
            })
            .catch(error => {
                console.error("There was an error adding the product!", error);
                setNotification({
                    visible: true,
                    mensaje: 'Error al agregar el producto. Inténtelo de nuevo.',
                    tipo: 'error'
                });
            });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleImageChange(e.dataTransfer.files);
    };

    const handleImageRemove = (index) => {
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="add-product-container">
            {notification.visible && <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} />}
            <h1>Agregar Producto</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={productData.nombre} onChange={handleChange} required />
                </label>
                <label>
                    Precio:
                    <input type="number" name="precio" value={productData.precio} onChange={handleChange} required />
                </label>
                <label>
                    Descripción:
                    <textarea  name="descripcion" value={productData.descripcion} onChange={handleChange} required></textarea>
                </label>
                <label>
                    Restaurante:
                    <select name="id_restaurant" value={productData.id_restaurant} onChange={handleChange} required className="restaurant-select">
                        <option value="">Seleccione un restaurante</option>
                        {restaurants.map(restaurant => (
                            <option key={restaurant._id} value={restaurant._id}>{restaurant.nombre}</option>
                        ))}
                    </select>
                </label>
                <div className="tags-container">
                    <h3>Tags:</h3>
                    {availableTags.map((tag, index) => (
                        <label 
                            key={index} 
                            className={`tag-item ${productData.tags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleTagChange(tag)}
                        >
                            <input
                                type="checkbox"
                                value={tag}
                                onChange={() => handleTagChange(tag)}
                                checked={productData.tags.includes(tag)}
                            />
                            {tag}
                        </label>
                    ))}
                </div>
                <div className="image-upload-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files)}
                        multiple
                        className="image-input"
                    />
                    <div className="upload-instructions">
                        Seleccione imágenes o arrastre las imágenes aquí (Hasta 3 imágenes).
                    </div>
                    {imagePreviews.length > 0 && (
                    <div className="image-preview-container">
                        {imagePreviews.map((preview, index) => (
                            <div className="image-preview-wrapper" key={index}>
                                <span
                                    className="delete-image-button"
                                    onClick={() => handleImageRemove(index)}
                                >
                                    -
                                </span>
                                <img src={preview} alt={`Vista previa ${index}`} className="image-preview" />
                            </div>
                        ))}
                    </div>
                )}
                </div>
                <button type="submit">Agregar Producto</button>
            </form>
        </div>
    );
};

export default AddProduct;
