import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/AddClient.css';

const AddClient = () => {
    const [clientData, setClientData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        location: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData({
            ...clientData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://rikoapi.onrender.com/api/client/client-registrar', clientData)
            .then(response => {
                navigate('/clientes');
            })
            .catch(error => {
                console.error("There was an error registering the client!", error);
                alert("Error", error);
            });
    };

    const handleClear = () => {
        setClientData({
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
            password: "",
            location: "",
        });
    };

    return (
        <div className="add-client-container">
            <h1>Agregar Cliente</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={clientData.nombre} onChange={handleChange} required />
                </label>
                <label>
                    Apellido:
                    <input type="text" name="apellido" value={clientData.apellido} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={clientData.email} onChange={handleChange} required />
                </label>
                <label>
                    Teléfono:
                    <input type="text" name="telefono" value={clientData.telefono} onChange={handleChange} required />
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="password" value={clientData.password} onChange={handleChange} required />
                </label>
                <label>
                    Ubicación:
                    <input type="text" name="location" value={clientData.location} onChange={handleChange} required />
                </label>
                <button className="registerButton" type="submit">Registrar Cliente</button>
                <button className="clearButton" type="button" onClick={handleClear}>Limpiar Formulario</button>
            </form>
        </div>
    );
};

export default AddClient;
