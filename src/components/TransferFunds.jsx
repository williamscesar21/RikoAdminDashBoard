import React, { useState } from 'react';
import axios from 'axios';
import '../css/TransferFunds.css';
import Notificacion from "./Notificacion";

const TransferFunds = () => {
    const [fromWalletId, setFromWalletId] = useState('');
    const [toWalletId, setToWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ visible: false, mensaje: '', tipo: '' });

    const handleTransferFunds = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification({
            visible: true,
            mensaje: 'Procesando transferencia...',
            tipo: 'procesando'
        });

        try {
            const response = await axios.post('https://rikoapi.onrender.com/api/wallets/wallet-transfer', {
                fromWalletId,
                toWalletId,
                amount: parseFloat(amount),
                description
            });

            if (response.status === 200) {
                setNotification({
                    visible: true,
                    mensaje: 'Transferencia realizada exitosamente',
                    tipo: 'exitoso'
                });
                setTimeout(() => {
                    setNotification({
                        visible: false,
                        mensaje: '',
                        tipo: ''
                    });
                }, 3000);
                // Recargar la página para ver los cambios reflejados
                window.location.reload();
            } else {
                // Si la respuesta no es un estado 200, lanzamos un error para manejarlo en el catch
                throw new Error('Error al realizar la transferencia');
            }
        } catch (error) {
            setNotification({
                visible: true,
                mensaje: 'Hubo un error al realizar la transferencia',
                tipo: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transfer-funds-container">
            {notification.visible && <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} />}
            <h1>Transfer Funds</h1>
            <form onSubmit={handleTransferFunds} className="transfer-funds-form">
                <div className="form-group">
                    <label htmlFor="fromWalletId">From Wallet ID:</label>
                    <input
                        type="text"
                        id="fromWalletId"
                        value={fromWalletId}
                        onChange={(e) => setFromWalletId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="toWalletId">To Wallet ID:</label>
                    <input
                        type="text"
                        id="toWalletId"
                        value={toWalletId}
                        onChange={(e) => setToWalletId(e.target.value)}
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
                    {loading ? 'Processing...' : 'Transfer Funds'}
                </button>
            </form>
        </div>
    );
};

export default TransferFunds;
