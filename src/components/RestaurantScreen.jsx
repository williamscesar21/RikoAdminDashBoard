import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/RestaurantScreen.css';
import Loading from "./Loading";
import { FaLocationDot, FaPencil, FaCheck, FaTrash } from "react-icons/fa6";
import { FaStar, FaTimesCircle } from "react-icons/fa";
import Notificacion from "./Notificacion";
import ProductCard from './ProductCard';
import RestaurantImage from "./RestaurantImage";
import PagoMovilForm from "./PagoMovilForm";

const RestaurantScreen = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        telefono: '',
        email: '',
        horario_de_trabajo: [],
        password: '',
        suspendido: null
    });
    const [notification, setNotification] = useState({
        visible: false,
        mensaje: '',
        tipo: ''
    });

    useEffect(() => {
        // Fetch restaurant data
        axios.get(`https://rikoapi.onrender.com/api/restaurant/restaurant/${id}`)
            .then(response => {
                setRestaurant(response.data);
                setEditableFields({
                    nombre: response.data.nombre,
                    descripcion: response.data.descripcion,
                    ubicacion: response.data.ubicacion,
                    telefono: response.data.telefono,
                    email: response.data.email,
                    horario_de_trabajo: response.data.horario_de_trabajo,
                    suspendido: response.data.suspendido,
                });
            })
            .catch(error => {
                console.error("There was an error fetching the restaurant data!", error);
            });

        // Fetch products for the restaurant
        axios.get(`https://rikoapi.onrender.com/api/product/product?restaurantId=${id}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the products data!", error);
            });
    }, [id]);

    const handleScheduleChange = (e, index, type) => {
        const newSchedule = [...editableFields.horario_de_trabajo];
        newSchedule[index] = { ...newSchedule[index], [type]: e.target.value };
        setEditableFields({
            ...editableFields,
            horario_de_trabajo: newSchedule
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes} ${ampm}`;
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditableFields({
            ...editableFields,
            [name]: value
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditableFields({
            ...editableFields,
            password: '' // clear the password field when editing is cancelled
        });
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setNotification({
            visible: true,
            mensaje: 'Procesando cambios...',
            tipo: 'procesando'
        });

        const promises = [];
        Object.keys(editableFields).forEach((field) => {
            if (restaurant[field] !== editableFields[field] && field !== 'password') {
                promises.push(
                    axios.put(`https://rikoapi.onrender.com/api/restaurant/restaurant/${id}`, {
                        propiedad: field,
                        valor: editableFields[field]
                    })
                );
            }
        });

        if (promises.length > 0) {
            Promise.all(promises)
                .then(responses => {
                    setRestaurant(prevState => ({ ...prevState, ...editableFields }));
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
                    console.error("There was an error updating the restaurant data!", error);
                    setNotification({
                        visible: true,
                        mensaje: 'Error al guardar los cambios. Inténtelo de nuevo',
                        tipo: 'error'
                    });
                });
        } else {
            setNotification({
                visible: false,
                mensaje: '',
                tipo: ''
            });
        }
    };

    const handleUpdatePassword = () => {
        if (editableFields.password.trim() === '') {
            setNotification({
                visible: true,
                mensaje: 'La contraseña no puede estar vacía',
                tipo: 'error'
            });
            return;
        }

        if (!confirm('¿Estás seguro de que quieres cambiar la contraseña del restaurante?')) {
            return;
        }

        setNotification({
            visible: true,
            mensaje: 'Procesando cambios...',
            tipo: 'procesando'
        });

        axios.put(`https://rikoapi.onrender.com/api/restaurant/restaurant-password/${id}`, { password: editableFields.password })
            .then(response => {
                setNotification({
                    visible: true,
                    mensaje: 'Contraseña actualizada',
                    tipo: 'exitoso'
                });
                setEditableFields({
                    ...editableFields,
                    password: '' // clear password field after update
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
                console.error("There was an error updating the restaurant password!", error);
                setNotification({
                    visible: true,
                    mensaje: 'Error al actualizar la contraseña. Inténtelo de nuevo',
                    tipo: 'error'
                });
            });
    };

    const handleDeleteRestaurant = () => {
        const password = prompt('Por favor, ingrese la contraseña para eliminar este restaurante:');
    
        if (password !== '3149196816043108') {
            alert('Contraseña incorrecta. No se puede eliminar el restaurante.');
            return;
        }
    
        if (!confirm('¿Estás seguro de que quieres eliminar este restaurante? Esta acción es irreversible.')) {
            return;
        }
    
        setNotification({
            visible: true,
            mensaje: 'Eliminando restaurante...',
            tipo: 'procesando'
        });
    
        axios.delete(`https://rikoapi.onrender.com/api/restaurant/restaurant/${id}`)
            .then(response => {
                setNotification({
                    visible: true,
                    mensaje: 'Restaurante eliminado exitosamente',
                    tipo: 'exitoso'
                });
                setTimeout(() => {
                    setNotification({
                        visible: false,
                        mensaje: '',
                        tipo: ''
                    });
                    navigate('/restaurants'); // Redirige a la lista de restaurantes
                }, 3000);
                window.location.href = '/restaurantes';
            })
            .catch(error => {
                console.error("There was an error deleting the restaurant!", error);
                setNotification({
                    visible: true,
                    mensaje: 'Error al eliminar el restaurante. Inténtelo de nuevo',
                    tipo: 'error'
                });
            });
    };
    

    if (!restaurant) return <div><Loading /></div>;

    return (
        <div className="restaurant-screen-container">
            {notification.visible ? <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} /> : <></>}
            <div className="restaurant-screen-info">
                <div className="resScreenHeader">
                <RestaurantImage restaurant={restaurant} />
                    <div>
                        {isEditing ? (
                            <input
                                className="restaurant-name"
                                type="text"
                                name="nombre"
                                value={editableFields.nombre}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            <h1 className="restaurant-name">{restaurant.nombre}</h1>
                        )}
                        <p> <FaLocationDot /> <strong>Ubicación: </strong>
                            {isEditing ? (
                                <input
                                    className="restaurant-location"
                                    type="text"
                                    name="ubicacion"
                                    value={editableFields.ubicacion}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                restaurant.ubicacion
                            )}
                        </p>
                        <p> <FaStar /> {restaurant.calificacion.promedio.toFixed(2)} ({restaurant.calificacion.calificaciones.length})</p>
                        <p>
                            {isEditing ? (
                                <textarea
                                    className="restaurant-description"
                                    name="descripcion"
                                    value={editableFields.descripcion}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                restaurant.descripcion
                            )}
                        </p>
                    </div>
                </div>
                <div className="resScreenContent">
                    <p><strong>Horario de trabajo:</strong></p>
                    <table className="horario-table">
                        <thead>
                            <tr>
                                <th>Día</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurant.horario_de_trabajo.map((horario, index) => (
                                <tr key={index}>
                                    <td>{horario.dia[0].toUpperCase() + horario.dia.slice(1)}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="time"
                                                onChange={(e) => handleScheduleChange(e, index, 'inicio')}
                                                value={editableFields.horario_de_trabajo[index].inicio}
                                            />
                                        ) : (
                                            convertTo12HourFormat(horario.inicio)
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="time"
                                                onChange={(e) => handleScheduleChange(e, index, 'fin')}
                                                value={editableFields.horario_de_trabajo[index].fin}
                                            />
                                        ) : (
                                            convertTo12HourFormat(horario.fin)
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p><strong>Teléfono: </strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="telefono"
                                value={editableFields.telefono}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            restaurant.telefono
                        )}
                    </p>
                    <p><strong>Email: </strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="email"
                                value={editableFields.email}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            restaurant.email
                        )}
                    </p>
                    <p><strong>Creado el:</strong> {formatDate(restaurant.createdAt)}</p>
                    <p><strong>Actualizado el:</strong> {formatDate(restaurant.updatedAt)}</p>
                    <div className="suspendido">
                        <p><strong>Suspendido:</strong></p>
                        {isEditing ? (
                            <select
                                name="suspendido"
                                value={editableFields.suspendido}
                                onChange={handleFieldChange}
                            >
                                <option value="true">Si</option>
                                <option value="false">No</option>
                            </select>
                        ) : (
                            <p>{restaurant.suspendido ? 'Si' : 'No'}</p>
                        )}
                        </div>
                    <p><strong>Actualizar Password:</strong></p>
                    <input
                        className="update-password-input"
                        type="password"
                        name="password"
                        value={editableFields.password}
                        onChange={handleFieldChange}
                        placeholder="Password"
                    />
                    <button className="update-password-button" onClick={handleUpdatePassword}>Actualizar Password</button>
               <PagoMovilForm
                        id={id}
                        setNotification={setNotification}
                        setRestaurant={setRestaurant}
                        restaurant={restaurant}
                        isEditing={isEditing}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'column' }} className="products-section">
                    <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Productos</h2>
                    <br />
                    <div className="products-grid">
                        {products
                            .filter(product => product.id_restaurant === id)
                            .map(product => (
                                <ProductCard restaurantName={restaurant.nombre} key={product.id} product={product} />
                            ))}
                    </div>
                </div>
                </div>
                
                
                <div className="edit-client-buttons">
                    {isEditing ? (
                        <>
                            <button className="cancel-edit-client-button" onClick={handleCancelEdit}>
                                <FaTimesCircle /> 
                            </button>
                            <button className="save-edit-client-button" onClick={handleSaveClick}>
                                <FaCheck />
                            </button>
                        </>
                    ) : (
                        <button className="edit-client-button" onClick={handleEditClick}>
                            <FaPencil />
                        </button>
                    )}
                    <button className="cancel-edit-client-button" onClick={handleDeleteRestaurant}>
                        <FaTrash /> 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantScreen;
