import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/RepartidorScreen.css';
import Loading from "./Loading";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { FaTimesCircle, FaRegCopy, FaTrash } from "react-icons/fa";
import Notificacion from "./Notificacion";
import RepartidorImage from "./RepartidorImage";

const RepartidorScreen = () => {
    const { id } = useParams();
    const [repartidor, setRepartidor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState({
        nombre: '',
        apellido: '',
        location: '',
        telefono: '',
        email: '',
        password: '',
        estatus: '',
        suspendido: null,
        vehiculo: {
            matricula: '',
            marca: '',
            modelo: '',
            color: ''
        }
    });
    const [notification, setNotification] = useState({
        visible: false,
        mensaje: '',
        tipo: ''
    });

    useEffect(() => {
        axios.get(`https://rikoapi.onrender.com/api/repartidor/repartidor/${id}`)
            .then(response => {
                setRepartidor(response.data);
                setEditableFields({
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    location: response.data.location,
                    telefono: response.data.telefono,
                    email: response.data.email,
                    estatus: response.data.estatus,
                    suspendido: response.data.suspendido,
                    vehiculo: {
                        matricula: response.data.vehiculo.matricula,
                        marca: response.data.vehiculo.marca,
                        modelo: response.data.vehiculo.modelo,
                        color: response.data.vehiculo.color
                    }
                });
            })
            .catch(error => {
                console.error("There was an error fetching the repartidor data!", error);
            });
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        if (name in editableFields.vehiculo) {
            setEditableFields({
                ...editableFields,
                vehiculo: {
                    ...editableFields.vehiculo,
                    [name]: value
                }
            });
        } else {
            setEditableFields({
                ...editableFields,
                [name]: value
            });
        }
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
            if (repartidor[field] !== editableFields[field] && field !== 'password') {
                promises.push(
                    axios.put(`https://rikoapi.onrender.com/api/repartidor/repartidor/${id}`, {
                        propiedad: field,
                        valor: editableFields[field]
                    })
                );
            }
        });

        if (promises.length > 0) {
            Promise.all(promises)
                .then(responses => {
                    setRepartidor(prevState => ({ ...prevState, ...editableFields }));
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
                    console.error("There was an error updating the repartidor data!", error);
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

        setNotification({
            visible: true,
            mensaje: 'Procesando cambios...',
            tipo: 'procesando'
        });

        axios.put(`https://rikoapi.onrender.com/api/repartidor/repartidor-password/${id}`, { password: editableFields.password })
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
                console.error("There was an error updating the repartidor password!", error);
                setNotification({
                    visible: true,
                    mensaje: 'Error al actualizar la contraseña. Inténtelo de nuevo',
                    tipo: 'error'
                });
            });
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(repartidor._id);
        setNotification({
            visible: true,
            mensaje: 'ID copiado al portapapeles',
            tipo: 'exitoso'
        });
        setTimeout(() => {
            setNotification({
                visible: false,
                mensaje: '',
                tipo: ''
            });
        }, 3000);
    };

    const handleDeleteClick = () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este repartidor?")) {
            axios.delete(`https://rikoapi.onrender.com/api/repartidor/repartidor/${id}`)
                .then(response => {
                    setNotification({
                        visible: true,
                        mensaje: 'Repartidor eliminado correctamente',
                        tipo: 'exitoso'
                    });
                    setTimeout(() => {
                        setNotification({
                            visible: false,
                            mensaje: '',
                            tipo: ''
                        });
                        window.location.href = '/repartidores';
                    }, 3000);
                })
                .catch(error => {
                    console.error("There was an error deleting the repartidor!", error);
                    setNotification({
                        visible: true,
                        mensaje: 'Error al eliminar el repartidor. Inténtelo de nuevo',
                        tipo: 'error'
                    });
                });
        }
    };

    if (!repartidor) return <div><Loading /></div>;

    return (
        <div className="repartidor-screen-container">
            <div className="repartidor-name">
                <RepartidorImage repartidor={repartidor}/>
                <div className="repartidor-name-container">
                        {isEditing ? (
                            <>
                                <input
                                    className="repartidor-name-input"
                                    type="text"
                                    name="nombre"
                                    value={editableFields.nombre}
                                    onChange={handleFieldChange}
                                />
                                <input
                                    className="repartidor-name-input"
                                    type="text"
                                    name="apellido"
                                    value={editableFields.apellido}
                                    onChange={handleFieldChange}
                                />
                            </>
                        ) : (
                            <>
                                <h1 className="repartidor-name">{repartidor.nombre + ' ' + repartidor.apellido}</h1>
                                <p className="repartidor-id">{repartidor._id} <span onClick={handleCopyClick}><FaRegCopy /></span></p>
                            </>
                        )}
                        </div>
                        </div>
            {notification.visible ? <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} /> : <></>}
            <div className="repartidor-screen-info">
                <div className="repartidorScreenHeader">
                    <div>
                        <p><strong>Dirección:</strong>
                            {isEditing ? (
                                <input
                                    className="repartidor-address"
                                    type="text"
                                    name="location"
                                    value={editableFields.location}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                repartidor.location
                            )}
                        </p>
                        <p><strong>Estado en la app: </strong>{repartidor.estatus}</p>
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
                            <p>{repartidor.suspendido ? 'Si' : 'No'}</p>
                        )}
                        </div>
                    </div>
                </div>
                <div className="repartidorScreenContent">
                    <p><strong>Teléfono: </strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="telefono"
                                value={editableFields.telefono}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            repartidor.telefono
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
                            repartidor.email
                        )}
                    </p>
                    <p><strong>Vehículo:</strong></p>
                    <div className="vehiculo-info">
                        <p><strong>Matrícula: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="matricula"
                                    value={editableFields.vehiculo.matricula}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                repartidor.vehiculo.matricula
                            )}
                        </p>
                        <p><strong>Marca: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="marca"
                                    value={editableFields.vehiculo.marca}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                repartidor.vehiculo.marca
                            )}
                        </p>
                        <p><strong>Modelo: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="modelo"
                                    value={editableFields.vehiculo.modelo}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                repartidor.vehiculo.modelo
                            )}
                        </p>
                        <p><strong>Color: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="color"
                                    value={editableFields.vehiculo.color}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                repartidor.vehiculo.color
                            )}
                        </p>
                    </div>
                    <p><strong>Creado el:</strong> {formatDate(repartidor.createdAt)}</p>
                    <p><strong>Actualizado el:</strong> {formatDate(repartidor.updatedAt)}</p>
                    <p><strong>Actualizar Password:</strong></p>
                    <input
                        type="password"
                        name="password"
                        value={editableFields.password}
                        onChange={handleFieldChange}
                        className="update-password-input"
                        placeholder="Nueva Password"
                    />
                    <button onClick={handleUpdatePassword} className="update-password-button">Actualizar Password</button>
                </div>
                <div className="edit-repartidor-buttons">
                    {isEditing ? (
                        <>
                            <button className="cancel-edit-repartidor-button" onClick={handleCancelEdit}><FaTimesCircle /></button>
                            <button className="save-edit-repartidor-button" onClick={handleSaveClick}><FaCheck /></button>
                        </>
                    ) : (
                        <>
                            <button className="edit-repartidor-button" onClick={handleEditClick}><FaPencil /></button>
                            <button className="cancel-edit-repartidor-button" onClick={handleDeleteClick}><FaTrash /></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepartidorScreen;
