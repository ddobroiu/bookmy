// /src/components/CategoryCard.jsx (COD ACTUALIZAT PENTRU TOATE DOMENIILE)

import React from 'react';
import Link from 'next/link';
// Importăm un set extins de pictograme pentru toate categoriile
import { 
    FaCut, FaStethoscope, FaSpa, FaUtensils, FaDumbbell, 
    FaCar, FaHome, FaGraduationCap, FaPaw, FaGlassCheers, 
    FaBriefcase, FaTaxi, FaEllipsisH
} from 'react-icons/fa';

const getIconComponent = (iconName) => {
  const icons = {
    'beauty': FaCut,          // Frumusețe (Frizerie, Unghii, Make-up)
    'health': FaStethoscope,  // Sănătate (Dentist, Medici, Psiholog)
    'wellness': FaSpa,        // Relaxare (Masaj, Spa, Terapii)
    'food': FaUtensils,       // Horeca (Restaurante, Cafenele)
    'fitness': FaDumbbell,    // Sport (Săli, Antrenori, Yoga)
    'auto': FaCar,            // Auto (Service, Spălătorie)
    'home': FaHome,           // Casă (Instalatori, Curățenie)
    'education': FaGraduationCap, // Educație (Meditații, Cursuri)
    'pets': FaPaw,            // Animale (Vet, Grooming)
    'events': FaGlassCheers,  // Evenimente (Foto, DJ, Florării)
    'pro': FaBriefcase,       // Business (Avocați, Notari)
    'transport': FaTaxi,      // Transport (Închirieri, Transfer)
    'other': FaEllipsisH      // Altele
  };
  return icons[iconName] || FaEllipsisH; 
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '16px', // Rotunjire mai modernă
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  textAlign: 'center',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#1c2e40',
  border: '1px solid transparent'
};

const iconStyle = {
  fontSize: '42px',
  marginBottom: '15px',
  color: '#007bff' // Culoarea brandului
};

const CategoryCard = ({ title, iconName, href, subtext }) => {
  const IconComponent = getIconComponent(iconName); 
  
  return (
    <Link href={href} style={cardStyle} className="category-card-hover">
      <div style={iconStyle}>
        <IconComponent /> 
      </div>
      <div style={{fontSize: '18px', marginBottom: '5px'}}>{title}</div>
      {/* Afișăm și un mic text descriptiv (ex: "3 Subcategorii") */}
      {subtext && <div style={{fontSize: '12px', color: '#888', fontWeight: '400'}}>{subtext}</div>}
    </Link>
  );
};

export default CategoryCard;