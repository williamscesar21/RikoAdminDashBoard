import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../css/Clients.css';
import Loading from "./Loading";

const Clients = () => {
    const [clients, setClients] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('https://rikoapi.onrender.com/api/client/client-obtener')
            .then(response => {
                setClients(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the clients data!", error);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCLientClick = (id) => {
        window.location.href = `/clientes/${id}`;
    };

    if (!clients) return <div><Loading /></div>;
    
    //Si mo hay clientes mostrar "Esta seccion no tiene datos para mostrar"
    if (clients.length === 0) {
        return (
            <div className="clients-container">
                <h1>Esta sección no tiene datos para mostrar</h1>
            </div>
        );
    }

    const filteredClients = clients.filter((client) =>
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telefono.includes(searchTerm)
    );

    return (
        <div className="clients-container">
            <h1>Lista de Clientes</h1>
            <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            <table className="clients-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estatus</th>
                        <th>Creado el</th>
                        <th>Suspendido</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map((client, index) => (
                        <tr onClick={() => handleCLientClick(client._id)} key={index}>
                            <td>{client.nombre}</td>
                            <td>{client.apellido}</td>
                            <td>{client.email}</td>
                            <td>{client.telefono}</td>
                            <td>{client.estatus}</td>
                            <td>{formatDate(client.createdAt)}</td>
                            <td>{client.suspendido.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/clientes/addcliente" className="add-client-button">+</Link>
        </div>
    );
};

export default Clients;
