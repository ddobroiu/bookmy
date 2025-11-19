// /src/app/page.js (COD COMPLET ACTUALIZAT - CU CHAT PE HOME)

'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import CategoryCard from '../components/CategoryCard'; 
import AIChatBooking from '../components/AIChatBooking'; // Import Chat
import Link from 'next/link';
import { FaSearch, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';

export default function HomePage() {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault(); 
    const query = new URLSearchParams();
    if (searchTerm) query.append('q', searchTerm);
    if (location) query.append('loc', location);
    router.push(`/search?${query.toString()}`);
  };

  // Categorii
  const categories = [
    { title: 'Frumusețe', iconName: 'beauty', href: '/search?cat=beauty', desc: 'Frizerie, Coafor, Unghii' },
    { title: 'Sănătate', iconName: 'health', href: '/search?cat=health', desc: 'Stomatologie, Clinici' },
    { title: 'Wellness', iconName: 'wellness', href: '/search?cat=wellness', desc: 'Masaj, Spa' },
    { title: 'Restaurante', iconName: 'food', href: '/search?cat=food', desc: 'Restaurante, Cafenele' },
    { title: 'Fitness', iconName: 'fitness', href: '/search?cat=fitness', desc: 'Săli, Antrenori' },
    { title: 'Auto', iconName: 'auto', href: '/search?cat=auto', desc: 'Service, Spălătorie' },
    { title: 'Servicii Casă', iconName: 'home', href: '/search?cat=home', desc: 'Curățenie, Instalatori' },
    { title: 'Animale', iconName: 'pets', href: '/search?cat=pets', desc: 'Veterinar, Toaletaj' },
  ];

  const ctaStyle = {
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    marginTop: '60px',
    marginBottom: '60px',
    textAlign: 'center',
    border: '1px solid #f0f0f0',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
  };

  const ctaButtonStyle = {
    padding: '16px 35px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '700',
    display: 'inline-block',
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
  };

  return (
    <div className={styles.homeContainer}>
      
      {/* Hero */}
      <div style={{marginBottom: '50px', paddingTop: '20px'}}>
        <h1 className={styles.title} style={{fontSize: '48px', marginBottom: '15px'}}>
          Orice Serviciu. O Singură Aplicație.
        </h1>
        <p className={styles.tagline} style={{fontSize: '20px', maxWidth: '700px', margin: '0 auto 40px auto'}}>
          Descoperă și rezervă instant la peste 50.000 de afaceri locale.
        </p>
      </div>

      {/* Search */}
      <div className={styles.searchBox}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.inputWrapper} style={{position: 'relative', flexGrow: 1}}>
             <FaSearch style={{position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999'}} />
             <input 
                className={styles.inputField} 
                type="text" 
                placeholder="Ce cauți? (ex: Tuns, Pizza)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{paddingLeft: '40px', width: '100%'}}
             />
          </div>
          <div className={styles.inputWrapper} style={{position: 'relative', flexGrow: 1}}>
             <FaMapMarkerAlt style={{position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999'}} />
             <input 
                className={styles.inputField} 
                type="text" 
                placeholder="Oraș" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{paddingLeft: '40px', width: '100%'}}
             />
          </div>
          <button className={styles.searchButton} type="submit" style={{flexGrow: 0, minWidth: '150px'}}>
            Caută
          </button>
        </form>
      </div>

      {/* SECȚIUNE NOUĂ: AI Chat Assistant */}
      <section className="container" style={{marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{
            background: 'linear-gradient(135deg, #e0f2ff 0%, #ffffff 100%)', 
            borderRadius: '20px', 
            padding: '40px', 
            width: '100%', 
            maxWidth: '1000px',
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            flexWrap: 'wrap'
        }}>
            <div style={{flex: '1', minWidth: '300px'}}>
                <div style={{display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', padding: '5px 15px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                    <FaRobot style={{color: '#007bff'}} /> <span style={{fontWeight: '600', color: '#1c2e40', fontSize: '14px'}}>Nou: Asistent AI</span>
                </div>
                <h2 style={{color: '#1c2e40', fontSize: '32px', marginBottom: '15px'}}>Nu știi ce să alegi?</h2>
                <p style={{fontSize: '18px', color: '#555', lineHeight: '1.6', marginBottom: '20px'}}>
                    Discută cu asistentul nostru virtual. Îți poate recomanda restaurante, poate verifica disponibilitatea la saloane sau îți poate răspunde la întrebări.
                </p>
                <p style={{fontSize: '14px', color: '#888'}}>
                    *Disponibil 24/7, chiar și fără cont.
                </p>
            </div>
            
            <div style={{flex: '1', minWidth: '300px', maxWidth: '400px'}}>
                {/* Aici montăm componenta de Chat */}
                <AIChatBooking />
            </div>
        </div>
      </section>

      {/* Categorii */}
      <section className={`${styles.categoriesSection} container`} style={{marginTop: '80px'}}>
        <h2 style={{color: '#1c2e40', fontSize: '28px', marginBottom: '30px'}}>Explorare după Categorie</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px'}}>
            {categories.map((cat) => (
                <CategoryCard 
                    key={cat.title}
                    title={cat.title}
                    iconName={cat.iconName}
                    href={cat.href}
                    subtext={cat.desc}
                />
            ))}
        </div>
      </section>

      {/* CTA */}
      <section style={ctaStyle} className="container">
        <h2 style={{color: '#1c2e40', marginBottom: '15px', fontSize: '32px'}}>Deții o afacere?</h2>
        <p style={{color: '#666', marginBottom: '30px', fontSize: '18px'}}>
            Înscrie-te gratuit și digitalizează-ți afacerea în 5 minute.
        </p>
        <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
            <Link href="/inregistrare-afacere" passHref legacyBehavior>
                <a style={ctaButtonStyle}>Devino Partener</a>
            </Link>
            <Link href="/inregistrare-client" passHref legacyBehavior>
                <a style={{...ctaButtonStyle, backgroundColor: 'white', color: '#007bff', border: '2px solid #007bff', boxShadow: 'none'}}>
                    Cont Client
                </a>
            </Link>
        </div>
      </section>
    </div>
  );
}