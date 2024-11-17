import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import '../css/PaymentVerification.css';

function encryptAES256(message) {
    // Usar una clave fija, derivada del mensaje o cualquier otro método que prefieras
    const key = CryptoJS.enc.Hex.parse('000102030405060708090A0B0C0D0E0F'); // Ejemplo de clave fija de 16 bytes (128 bits)

    // Encriptar el mensaje con la clave fija
    const encrypted = CryptoJS.AES.encrypt(message, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString(); // Devuelve el valor cifrado en base64
}

const PaymentVerification = () => {
    const [originMobile, setOriginMobile] = useState('');
    const [destinationMobile, setDestinationMobile] = useState('');
    const [paymentReference, setPaymentReference] = useState('');
    const [trxDate, setTrxDate] = useState('');
    const [amount, setAmount] = useState('');
    const [encryptedData, setEncryptedData] = useState({});

    const handleEncryptData = () => {
        const encryptedOriginMobile = encryptAES256(originMobile);
        const encryptedDestinationMobile = encryptAES256(destinationMobile);
        const encryptedPaymentReference = encryptAES256(paymentReference);
        const encryptedTrxDate = encryptAES256(trxDate);
        const encryptedAmount = encryptAES256(amount);

        setEncryptedData({
            encryptedOriginMobile,
            encryptedDestinationMobile,
            encryptedPaymentReference,
            encryptedTrxDate,
            encryptedAmount
        });
    };

    return (
        <div className="encryption-tool-container">
            <h2>Data Encryption Tool</h2>
            <div className="form-group">
                <label>Origin Mobile Number:</label>
                <input
                    type="text"
                    value={originMobile}
                    onChange={(e) => setOriginMobile(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Destination Mobile Number:</label>
                <input
                    type="text"
                    value={destinationMobile}
                    onChange={(e) => setDestinationMobile(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Payment Reference:</label>
                <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Transaction Date:</label>
                <input
                    type="date"
                    value={trxDate}
                    onChange={(e) => setTrxDate(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button onClick={handleEncryptData}>Encrypt Data</button>

            {Object.keys(encryptedData).length > 0 && (
                <div className="encrypted-data-container">
                    <h3>Encrypted Data</h3>
                    <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
                    <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(encryptedData, null, 2))}
                    >
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentVerification;
