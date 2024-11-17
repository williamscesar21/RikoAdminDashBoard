import React, { useState } from 'react';
import axios from 'axios';
import '../css/addFunds.css';
import Notificacion from "./Notificacion";

const AddFunds = () => {
    const [walletId, setWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ visible: false, mensaje: '', tipo: '' });

    const handleAddFunds = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification({
            visible: true,
            mensaje: 'Recargando billetera...',
            tipo: 'procesando'
        });

        try {
            const response = await axios.post('https://rikoapi.onrender.com/api/wallets/wallet-add-funds', {
                walletId,
                amount: parseFloat(amount),
                description
            });

            if (response.status === 200) {
                setNotification({
                    visible: true,
                    mensaje: 'Billetera recargada exitosamente',
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
            } else {
                // Si la respuesta no es un estado 200, lanzamos un error para manejarlo en el catch
                throw new Error('Error al recargar la billetera');
            }
        } catch (error) {
            setNotification({
                visible: true,
                mensaje: 'Hubo un error al recargar la billetera',
                tipo: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-funds-container">
            {notification.visible && <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} />}
            <h1>Add Funds to Wallet</h1>
            <form onSubmit={handleAddFunds} className="add-funds-form">
                <div className="form-group">
                    <label htmlFor="walletId">Wallet ID:</label>
                    <input
                        type="text"
                        id="walletId"
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Processing...' : 'Add Funds'}
                </button>
            </form>
        </div>
    );
};

export default AddFunds;
