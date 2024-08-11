import { useState, useEffect } from "react";
import axios from "axios";
import '../css/Admins.css';
import Cookies from 'js-cookie';
import Loading from "./Loading";

const Admins = () => {
    const [admins, setAdmins] = useState(null);
    const [myUsername, setMyUsername] = useState(Cookies.get('username'));
    const [newAdmin, setNewAdmin] = useState({
        username: '',
        password: '' // Asegúrate de manejar las contraseñas de forma segura
    });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('https://rikoapi.onrender.com/api/admin/admins')
            .then(response => {
                setAdmins(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the admin data!", error);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleDelete = (id) => {
        axios.delete(`https://rikoapi.onrender.com/api/admin/admin/${id}`)
            .then(response => {
                setAdmins(admins.filter(admin => admin._id !== id));
            })
            .catch(error => {
                console.error("There was an error deleting the admin!", error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();
        axios.post('https://rikoapi.onrender.com/api/admin/admin', newAdmin)
            .then(response => {
                setAdmins([...admins, response.data]);
                setNewAdmin({ username: '', password: '' }); // Clear the form
                setError(''); // Clear any previous errors
            })
            .catch(error => {
                console.error("There was an error creating the admin!", error);
                setError('Error al crear el administrador. Inténtelo de nuevo.');
            });
    };

    if (!admins) {
        return <div><Loading/></div>;
    }

    return (
        <div className="admins-container">
            <h2>Lista de Administradores</h2>
            <div className="admins-list">
                {admins.map((admin, index) => (
                    <div key={index} className="admin-card">
                        <h3>{admin.username}</h3>
                        <p>Creado el {formatDate(admin.createdAt)}</p>
                        {admin.username !== myUsername && admin.username !== 'williamscesar21' && (
                            <button className="delete-button" onClick={() => handleDelete(admin._id)}>Eliminar</button>
                        )}
                    </div>
                ))}
            </div>

            <div className="create-admin-section">
                <h3>Crear Nuevo Administrador</h3>
                <form onSubmit={handleAddAdmin}>
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={newAdmin.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={newAdmin.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="add-button">Añadir Administrador</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Admins;
