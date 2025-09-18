import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
import { AdvancedMarker, APIProvider, Pin, Map } from '@vis.gl/react-google-maps';
import '../css/AddRestaurant.css';

const AddRestaurant = () => {
    const [restaurantData, setRestaurantData] = useState({
        nombre: "",
        descripcion: "",
        calificaciones: [],
        images: [],
        ubicacion: "",
        horario_de_trabajo: [
            { dia: "lunes", inicio: "10:00", fin: "20:00" },
            { dia: "martes", inicio: "10:00", fin: "20:00" },
            { dia: "miércoles", inicio: "10:00", fin: "20:00" },
            { dia: "jueves", inicio: "10:00", fin: "20:00" },
            { dia: "viernes", inicio: "10:00", fin: "20:00" },
            { dia: "sábado", inicio: "10:00", fin: "20:00" },
            { dia: "domingo", inicio: "10:00", fin: "20:00" }
        ],
        telefono: "",
        email: "",
        password: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const mapRef = useRef(null); // Referencia al mapa

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            //setCurrentLocation({ lat: latitude, lng: longitude });
            setMarkerPosition({ lat: latitude, lng: longitude });
            setRestaurantData((prevData) => ({
                ...prevData,
                ubicacion: `${latitude}, ${longitude}`
            }));
            setIsMapLoaded(true);
        }, (error) => {
            console.error("Error getting geolocation:", error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData({
            ...restaurantData,
            [name]: value
        });
    };

    const handleHorarioChange = (index, field, value) => {
        const newHorario = [...restaurantData.horario_de_trabajo];
        newHorario[index][field] = value;
        setRestaurantData({
            ...restaurantData,
            horario_de_trabajo: newHorario
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageFile) {
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageURL = await getDownloadURL(storageRef);

            axios.post('https://rikoapi.onrender.com/api/restaurant/restaurant', { ...restaurantData, images: [imageURL] })
                .then(response => {
                    window.location.href = '/restaurantes';
                })
                .catch(error => {
                    console.error("There was an error adding the restaurant!", error);
                    alert("Error al agregar el restaurante. Inténtelo de nuevo.");
                });
        } else {
            alert("Please select an image to upload.");
        }
    };

    // if (!isMapLoaded) return <div>Cargando mapa...</div>;

    return (
        <div className="add-restaurant-container">
            <h1>Agregar Restaurante</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={restaurantData.nombre} onChange={handleChange} required />
                </label>
                <label>
                    Descripción:
                    <textarea name="descripcion" value={restaurantData.descripcion} onChange={handleChange} required></textarea>
                </label>
                <label>
                    Ubicación:
                    <input type="text" name="ubicacion" value={restaurantData.ubicacion} onChange={handleChange} required readOnly />
                    <div className="map-container" style={{ width: "100%", height: "50vh" }}>
                        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                            <Map
                                mapId={'d0892d1926793e5b'}
                                zoom={15}
                                center={markerPosition}
                                onLoad={(map) => (mapRef.current = map)} // Guardar la referencia del mapa
                            >
                                {markerPosition && (
                                    <AdvancedMarker
                                        draggable
                                        position={markerPosition}
                                        onDragEnd={(e) => {
                                            const lat = e.latLng.lat();
                                            const lng = e.latLng.lng();
                                            setMarkerPosition({ lat, lng });
                                            setRestaurantData({
                                                ...restaurantData,
                                                ubicacion: `${lat}, ${lng}`
                                            });
                                            if (mapRef.current) {
                                                mapRef.current.panTo({ lat, lng }); // Centrar el mapa en la nueva posición
                                            }
                                        }}
                                    >
                                        <Pin background={'#FBBC04'} glyphColor={'#fff'} borderColor={'#000'} />
                                    </AdvancedMarker>
                                )}
                            </Map>
                        </APIProvider>
                    </div>
                </label>
                <label>
                    Imagen:
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                </label>
                <label>
                    Teléfono:
                    <input type="text" name="telefono" value={restaurantData.telefono} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={restaurantData.email} onChange={handleChange} required />
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="password" value={restaurantData.password} onChange={handleChange} required />
                </label>
                <div className="horario-container">
                    <h3>Horario de Trabajo:</h3>
                    {restaurantData.horario_de_trabajo.map((horario, index) => (
                        <div key={index} className="horario-item">
                            <label>{horario.dia}</label>
                            <input
                                type="time"
                                value={horario.inicio}
                                onChange={(e) => handleHorarioChange(index, 'inicio', e.target.value)}
                                required
                            />
                            <span>a</span>
                            <input
                                type="time"
                                value={horario.fin}
                                onChange={(e) => handleHorarioChange(index, 'fin', e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
                <button type="submit">Agregar Restaurante</button>
            </form>
        </div>
    );
};

export default AddRestaurant;
