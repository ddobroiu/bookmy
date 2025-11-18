// /app/page.js (COD COMPLET ACTUALIZAT CU RUTE ȘI SECȚIUNE NOUĂ)

'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import CategoryCard from '../components/CategoryCard'; 
import Link from 'next/link'; // Import nou

export default function HomePage() {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault(); 
    
    const query = new URLSearchParams();
    if (searchTerm) {
        query.append('q', searchTerm);
    }
    if (location) {
        query.append('loc', location);
    }
    
    router.push(`/search?${query.toString()}`);
  };

  // Date de exemplu pentru categorii
  const categories = [
    { title: 'Tuns & Coafat', iconName: 'hair', href: '/search?q=tuns&loc=bucuresti' },
    { title: 'Manichiură', iconName: 'nails', href: '/search?q=manichiura&loc=cluj' },
    { title: 'Masaj', iconName: 'massage', href: '/search?q=masaj' },
    { title: 'Cosmetică', iconName: 'beauty', href: '/search?q=cosmetica' },
    { title: 'Stilist', iconName: 'stylist', href: '/search/stylist' },
    { title: 'Tatuaje', iconName: 'tattoo', href: '/search/tattoo' },
    { title: 'Fitness', iconName: 'fitness', href: '/search/fitness' },
    { title: 'Unelte', iconName: 'generic', href: '/search/generic' }, 
  ];

  const ctaStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginTop: '60px',
    marginBottom: '60px',
    textAlign: 'center',
  };

  const ctaButtonStyle = {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
  };


  return (
    <div className={styles.homeContainer}>
      
      {/* Zona de Titlu */}
      <div style={{boxShadow: 'none', backgroundColor: 'transparent'}}>
        <h1 className={styles.title}>
          Găsește Locația Potrivită
        </h1>
        <p className={styles.tagline}>
          Programează-te online la saloanele din apropiere.
        </p>
      </div>

      {/* Caseta de Căutare */}
      <div className={styles.searchBox}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input 
            className={styles.inputField} 
            type="text" 
            placeholder="Ce cauți? (ex: tuns, manichiură)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input 
            className={styles.inputField} 
            type="text" 
            placeholder="Unde? (Oraș sau Adresă)" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className={styles.searchButton} type="submit">
            Caută
          </button>
        </form>
      </div>

      {/* Secțiunea Categorii Populare */}
      <section className={`${styles.categoriesSection} container`}>
        <h2>Categorii Populare</h2>
        <p className={styles.tagline}>Descoperă servicii de top.</p>
        
        {/* Container pentru carduri */}
        <div style={{display: 'grid', 
                     gridTemplateColumns: 'repeat(4, 1fr)', 
                     gap: '20px', 
                     marginTop: '30px'}}>
            
            {categories.slice(0, 8).map((cat) => (
                <CategoryCard 
                    key={cat.title}
                    title={cat.title}
                    iconName={cat.iconName}
                    href={cat.href}
                />
            ))}
        </div>
      </section>

      {/* NOU: Call to Action pentru înregistrare clienți */}
      <section style={ctaStyle} className="container">
        <h2>Ești Gata Să Te Programezi?</h2>
        <p>Creează-ți un cont rapid pentru a salva locațiile favorite și a vedea istoricul programărilor.</p>
        <Link href="/inregistrare-client" passHref legacyBehavior>
            <a style={ctaButtonStyle}>
                Creează Cont Client
            </a>
        </Link>
      </section>
    </div>
  );
}