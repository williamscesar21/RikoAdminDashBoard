import { useState } from "react";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
import '../css/AddRepartidor.css';
import Notificacion from "./Notificacion";

const AddRepartidor = () => {
    const [repartidorData, setRepartidorData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        location: "",
        foto_perfil: [],
        vehiculo: {
            matricula: "",
            marca: "",
            modelo: "",
            color: "",
            foto_vehiculo: []
        },
        estatus: "Activo",
        suspendido: false
    });

    const [imageFile, setImageFile] = useState(null);
    const [vehicleImageFile, setVehicleImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [vehicleImagePreview, setVehicleImagePreview] = useState(null);
    const [notification, setNotification] = useState({ visible: false, mensaje: '', tipo: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRepartidorData({
            ...repartidorData,
            [name]: value
        });
    };

    const handleVehicleChange = (e) => {
        const { name, value } = e.target;
        setRepartidorData({
            ...repartidorData,
            vehiculo: {
                ...repartidorData.vehiculo,
                [name]: value
            }
        });
    };

    const handleImageChange = (e, setImageFileState, setImagePreviewState) => {
        const file = e.target.files[0];
        if (file) {
            setImageFileState(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewState(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({
            visible: true,
            mensaje: 'Creando repartidor...',
            tipo: 'procesando'
        });

        let profileImageUrl = "";
        let vehicleImageUrl = "";

        if (imageFile) {
            const profileImageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(profileImageRef, imageFile);
            profileImageUrl = await getDownloadURL(profileImageRef);
        }

        if (vehicleImageFile) {
            const vehicleImageRef = ref(storage, `images/${vehicleImageFile.name}`);
            await uploadBytes(vehicleImageRef, vehicleImageFile);
            vehicleImageUrl = await getDownloadURL(vehicleImageRef);
        }

        const repartidorPayload = {
            ...repartidorData,
            foto_perfil: profileImageUrl ? [profileImageUrl] : [],
            vehiculo: {
                ...repartidorData.vehiculo,
                foto_vehiculo: vehicleImageUrl ? [vehicleImageUrl] : []
            }
        };

        // Verificar que todos los campos requeridos estén presentes
        const { nombre, email, password, telefono, foto_perfil } = repartidorPayload;
        if (!nombre || !email || !password || !telefono || foto_perfil.length === 0) {
            setNotification({
                visible: true,
                mensaje: 'Todos los campos son requeridos',
                tipo: 'error'
            });
            return;
        }

        try {
            const response = await axios.post('https://rikoapi.onrender.com/api/repartidor/repartidor', repartidorPayload);
            setNotification({
                visible: true,
                mensaje: 'Repartidor agregado con éxito',
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
        } catch (error) {
            console.error("There was an error adding the repartidor!", error);
            setNotification({
                visible: true,
                mensaje: 'Error al agregar el repartidor. Inténtelo de nuevo.',
                tipo: 'error'
            });
        }
    };

    return (
        <div className="add-repartidor-container">
            {notification.visible && <Notificacion tipo={notification.tipo} mensaje={notification.mensaje} />}
            <h1>Agregar Repartidor</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={repartidorData.nombre} onChange={handleChange} required />
                </label>
                <label>
                    Apellido:
                    <input type="text" name="apellido" value={repartidorData.apellido} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={repartidorData.email} onChange={handleChange} required />
                </label>
                <label>
                    Teléfono:
                    <input type="text" name="telefono" value={repartidorData.telefono} onChange={handleChange} required />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={repartidorData.password} onChange={handleChange} required />
                </label>
                <label>
                    Ubicación:
                    <input type="text" name="location" value={repartidorData.location} onChange={handleChange} required />
                </label>
                <div className="image-upload-container">
                    <label>
                        Foto de Perfil:
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImageFile, setProfileImagePreview)} className="image-input" />
                    </label>
                    {profileImagePreview && <img src={profileImagePreview} alt="Vista previa de la foto de perfil" className="image-preview" />}
                </div>
                <h3>Datos del Vehículo:</h3>
                <label>
                    Matrícula:
                    <input type="text" name="matricula" value={repartidorData.vehiculo.matricula} onChange={handleVehicleChange} required />
                </label>
                <label>
                    Marca:
                    <input type="text" name="marca" value={repartidorData.vehiculo.marca} onChange={handleVehicleChange} required />
                </label>
                <label>
                    Modelo:
                    <input type="text" name="modelo" value={repartidorData.vehiculo.modelo} onChange={handleVehicleChange} required />
                </label>
                <label>
                    Color:
                    <input type="text" name="color" value={repartidorData.vehiculo.color} onChange={handleVehicleChange} required />
                </label>
                <div className="image-upload-container">
                    <label>
                        Foto del Vehículo:
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setVehicleImageFile, setVehicleImagePreview)} className="image-input" />
                    </label>
                    {vehicleImagePreview && <img src={vehicleImagePreview} alt="Vista previa de la foto del vehículo" className="image-preview" />}
                </div>
                <button type="submit">Agregar Repartidor</button>
            </form>
        </div>
    );
};

export default AddRepartidor;
