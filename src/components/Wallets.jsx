import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Wallets.css';
import Loading from './Loading';
import { MdAddCard, MdSend } from "react-icons/md";
import { BsCurrencyExchange } from "react-icons/bs";

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const goToWalletScreen = (user, userType) => {
        window.location.href = `/wallets/${user}/${userType}`;
    };

    useEffect(() => {
        axios.get('https://rikoapi.onrender.com/api/wallets/wallets')
            .then(response => {
                const sortedWallets = response.data.sort((a, b) => b.balance - a.balance);
                setWallets(sortedWallets);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching wallets:', error);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredWallets = wallets.filter(wallet => 
        wallet.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading />;

    return (
        <div className="wallets-container">
            <h1>Billeteras</h1>
            <input 
                type="text" 
                placeholder="Buscar billetera por ID de usuario, tipo de usuario o ID de billetera..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            <div className="wallets-list-actions">
                <div onClick={()=> {
                    window.location.href = '/wallets/addfunds';
                }} className='wallet-action'>
                    <MdAddCard />
                    <h4>Recargar</h4>
                </div>
                <div onClick={() => window.location.href = '/wallets/transfer'} className='wallet-action'>
                    <MdSend />
                    <h4>Transferir</h4>
                </div>
                <div className='wallet-action'>
                    <BsCurrencyExchange />
                    <h4>Cobrar</h4>
                </div>
            </div>
            <div className="wallets-list">
                {filteredWallets.map(wallet => (
                    <div onClick={() => goToWalletScreen(wallet.user, wallet.userType)} className="wallet-card" key={wallet._id}>
                        <div className="wallet-balance">
                            <h2>${wallet.balance.toFixed(2)}</h2>
                        </div>
                        <div className="wallet-info">
                            <p><strong>ID Usuario:</strong> {wallet.user}</p>
                            <p><strong>Tipo de Usuario:</strong> {wallet.userType}</p>
                            <p><strong>ID Billetera:</strong> {wallet._id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wallets;
