import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/WalletScreen.css';
import Loading from './Loading';

const WalletScreen = () => {
    const { user, userType } = useParams();
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://rikoapi.onrender.com/api/wallets/wallet/${user}/${userType}`)
            .then(response => {
                setWallet(response.data[0]);
                setLoading(false);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching wallet details:', error);
                setLoading(false);
            });
    }, [user, userType]);

    if (loading) return <Loading />;

    if (!wallet) return <div>Billetera no encontrada</div>;

    return (
        <div className="wallet-screen-container">
            <h1>Billetera: {wallet._id} </h1>
            <div className="wallet-details">
                <div className="wallet-info-2">
                    <p><strong>Balance:</strong> ${wallet.balance.toFixed(2)}</p>
                    <p><strong>Dueño:</strong> {wallet.userType} {wallet.user}</p>
                    <p><strong>Fecha de creación:</strong> {new Date(wallet.createdAt).toLocaleString()}</p>
                    <p><strong>Fecha de actualización:</strong> {new Date(wallet.updatedAt).toLocaleString()}</p>
                </div>

                <div className="wallet-transactions">
                    <h2>Transacciones</h2>
                    {wallet.transactions.length === 0 ? (
                        <p>No hay transacciones disponibles</p>
                    ) : (
                        wallet.transactions.map(transaction => (
                            <div className="transaction-card" key={transaction._id}>
                                <p><strong>Tipo:</strong> {transaction.type}</p>
                                <p><strong>Monto:</strong> ${transaction.amount}</p>
                                <p><strong>Descripción:</strong> {transaction.description}</p>
                                <p><strong>Fecha:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                                <p><strong>Referencia:</strong> {transaction._id}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletScreen;
