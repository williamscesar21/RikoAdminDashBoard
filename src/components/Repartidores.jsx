import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Repartidores.css';
import Loading from './Loading';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import RepartidorImage from './RepartidorImage';

const Repartidores = () => {
    const [repartidores, setRepartidores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://rikoapi.onrender.com/api/repartidor/repartidor')
            .then(response => {
                setRepartidores(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching repartidores:', error);
                setLoading(false);
            });
    }, []);

    const goToRepartidorScreen = (repartidorId) => {
        window.location.href = `/repartidores/repartidor/${repartidorId}`;
    };

    if (loading) return <Loading />;

    return (
        <div className="repartidores-container">
            <h1>Repartidores</h1>
            <div className="repartidores-list">
                {repartidores.map(repartidor => (
                    <div onClick={() => goToRepartidorScreen(repartidor._id)} className="repartidor-card" key={repartidor._id}>
                        <RepartidorImage repartidor={repartidor} />
                        <div className="repartidor-info">
                        <h2>{repartidor.nombre} {repartidor.apellido}</h2>
                        <p><FaPhone /> {repartidor.telefono}</p>
                        <p><FaEnvelope /> {repartidor.email}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/repartidores/addrepartidor" className="add-client-button">+</Link>
        </div>
    );
};

export default Repartidores;
