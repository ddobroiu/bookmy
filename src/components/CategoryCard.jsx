// /components/CategoryCard.jsx (COD COMPLET ACTUALIZAT CU REACT ICONS)

import React from 'react';
import Link from 'next/link';
// Importăm pictograme moderne din Font Awesome (Fa)
import { FaCut, FaPaintBrush, FaHands, FaSpa, FaRunning, FaPen, FaHeart } from 'react-icons/fa';

// Funcție ajutătoare pentru a mapa numele pictogramei la componentă
const getIconComponent = (iconName) => {
  const icons = {
    'hair': FaCut,         // Tuns & Coafat
    'nails': FaPaintBrush, // Manichiură (folosim FaPaintBrush ca exemplu)
    'massage': FaHands,    // Masaj
    'beauty': FaSpa,       // Cosmetică/Spa
    'stylist': FaHeart,    // Stilist (folosim FaHeart ca exemplu)
    'tattoo': FaPen,       // Tatuaje
    'fitness': FaRunning,  // Fitness
  };
  return icons[iconName] || FaHeart; // Pictogramă implicită dacă nu este găsită
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  textAlign: 'center',
  fontWeight: '600',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  minHeight: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#333'
};

const iconStyle = {
  fontSize: '36px',
  marginBottom: '10px',
  color: '#007bff'
};

const CategoryCard = ({ title, iconName, href }) => {
  // Obținem componenta pictogramă
  const IconComponent = getIconComponent(iconName); 
  
  return (
    <Link href={href} style={cardStyle}>
      <div style={iconStyle}>
        <IconComponent /> {/* Renderizăm componenta pictogramă */}
      </div>
      <div>{title}</div>
    </Link>
  );
};

export default CategoryCard;