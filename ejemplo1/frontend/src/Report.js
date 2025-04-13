import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Report.css';

function Report() {
  const navigate = useNavigate();
  const [images] = useState([
    "https://bucket-conferencia-ejemplo.s3.us-east-1.amazonaws.com/disk.png",
    "https://bucket-conferencia-ejemplo.s3.us-east-1.amazonaws.com/tree.png"
  ]);

  return (
    <div className="container">
      <div className="header">
        <button className="btn" onClick={() => navigate('/')}>Consola</button>
        <button className="btn" onClick={() => navigate('/reportes')}>Reportes</button>
      </div>
      <div className="content">
        <h2>Reportes</h2>
        <div className="image-gallery">
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Imagen ${index + 1}`} className="image-item" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;
