import { useState } from "react";

const RepartidorImage = ({ repartidor }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = repartidor.foto_perfil[0] ? repartidor.foto_perfil[0] : 'https://firebasestorage.googleapis.com/v0/b/rikoweb-ff259.appspot.com/o/replaceImg.png?alt=media&token=1424c858-8e15-4bdd-be84-df5955f2a11e';

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <img
            className="repartidor-image"
            src={imageError ? 'https://firebasestorage.googleapis.com/v0/b/rikoweb-ff259.appspot.com/o/replaceImg.png?alt=media&token=1424c858-8e15-4bdd-be84-df5955f2a11e' : imageUrl}
            alt={repartidor.nombre}
            onError={handleImageError}
        />
    );
};

export default RepartidorImage;
