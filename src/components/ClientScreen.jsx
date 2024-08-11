import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/ClientScreen.css';
import Loading from "./Loading";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { FaTimesCircle, FaRegCopy, FaTrash } from "react-icons/fa";
import Notificacion from "./Notificacion";

const ClientScreen = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState({
        nombre: '',
        apellido: '',
        location: '',
        telefono: '',
        email: '',
        password: '',
        estatus: '',
        suspendido: null
    });
    const [notification, setNotification] = useState({
        visible: false,
        mensaje: '',
        tipo: ''
    });

    useEffect(() => {
        axios.get(`https://rikoapi.onrender.com/api/client/client-obtener/${id}`)
            .then(response => {
                setClient(response.data);
                setEditableFields({
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    location: response.data.location,
                    telefono: response.data.telefono,
                    email: response.data.email,
                    estatus: response.data.estatus,
                    suspendido: response.data.suspendido
                });
            })
            .catch(error => {
                console.error("There was an error fetching the client data!", error);
            });
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
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
            if (client[field] !== editableFields[field] && field !== 'password') {
                promises.push(
                    axios.put(`https://rikoapi.onrender.com/api/client/client-actualizar-propiedad/${id}`, {
                        propiedad: field,
                        valor: editableFields[field]
                    })
                );
            }
        });

        if (promises.length > 0) {
            Promise.all(promises)
                .then(responses => {
                    setClient(prevState => ({ ...prevState, ...editableFields }));
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
                    console.error("There was an error updating the client data!", error);
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

        axios.put(`https://rikoapi.onrender.com/api/client/client-password/${id}`, { password: editableFields.password })
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
                console.error("There was an error updating the client password!", error);
                setNotification({
                    visible: true,
                    mensaje: 'Error al actualizar la contraseña. Inténtelo de nuevo',
                    tipo: 'error'
                });
            });
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(client._id);
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
        if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
            axios.delete(`https://rikoapi.onrender.com/api/client/client-eliminar/${id}`)
                .then(response => {
                    setNotification({
                        visible: true,
                        mensaje: 'Cliente eliminado correctamente',
                        tipo: 'exitoso'
                    });
                    setTimeout(() => {
                        setNotification({
                            visible: false,
                            mensaje: '',
                            tipo: ''
                        });
                        window.location.href = '/clientes';
                    }, 3000);
                })
                .catch(error => {
                    console.error("There was an error deleting the client!", error);
                    setNotification({
                        visible: true,
                        mensaje: 'Error al eliminar el cliente. Inténtelo de nuevo',
                        tipo: 'error'
                    });
                });
        }
    };

    if (!client) return <div><Loading /></div>;

    return (
        <div className="client-screen-container">
            {notification.visible ? <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} /> : <></>}
            <div className="client-screen-info">
                <div className="clientScreenHeader">
                    <div>
                        <div className="client-name">
                        {isEditing ? (
                            <>
                                <input
                                    className="client-name-input"
                                    type="text"
                                    name="nombre"
                                    value={editableFields.nombre}
                                    onChange={handleFieldChange}
                                />
                                <input
                                    className="client-name-input"
                                    type="text"
                                    name="apellido"
                                    value={editableFields.apellido}
                                    onChange={handleFieldChange}
                                />
                            </>
                        ) : (
                            <>
                                <h1 className="client-name">{client.nombre + ' ' + client.apellido}</h1>
                                <p className="client-id">{client._id} <span onClick={handleCopyClick}><FaRegCopy /></span></p>
                            </>
                        )}
                        </div>
                        <p><strong>Dirección:</strong>
                            {isEditing ? (
                                <input
                                    className="client-address"
                                    type="text"
                                    name="location"
                                    value={editableFields.location}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                client.location
                            )}
                        </p>
                        <p><strong>Estado en la app: </strong>{client.estatus}</p>
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
                            <p>{client.suspendido ? 'Si' : 'No'}</p>
                        )}
                        </div>
                    </div>
                </div>
                <div className="clientScreenContent">
                    <p><strong>Teléfono: </strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="telefono"
                                value={editableFields.telefono}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            client.telefono
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
                            client.email
                        )}
                    </p>
                    <p><strong>Creado el:</strong> {formatDate(client.createdAt)}</p>
                    <p><strong>Actualizado el:</strong> {formatDate(client.updatedAt)}</p>
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
                <div className="edit-client-buttons">
                    {isEditing ? (
                        <>
                            <button className="cancel-edit-client-button" onClick={handleCancelEdit}><FaTimesCircle /></button>
                            <button className="save-edit-client-button" onClick={handleSaveClick}><FaCheck /></button>
                        </>
                    ) : (
                        <>
                            <button className="edit-client-button" onClick={handleEditClick}><FaPencil /></button>
                            <button className="cancel-edit-client-button" onClick={handleDeleteClick}><FaTrash /></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientScreen;
