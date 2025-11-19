// /src/app/search/SearchClientPage.js (CONECTAT LA DATE REALE)

'use client'; 

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './search.module.css';
import { FaStar, FaMapMarkerAlt, FaMap, FaList, FaSpinner } from 'react-icons/fa';

const MapComponent = dynamic(() => import('../../components/Map'), { ssr: false });

export default function SearchClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Parametrii din URL
  const searchTerm = searchParams.get('q') || '';
  const category = searchParams.get('cat') || '';
  const location = searchParams.get('loc') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMapMobile, setShowMapMobile] = useState(false);

  // Fetch la schimbarea parametrilor
  useEffect(() => {
      async function fetchSalons() {
          setLoading(true);
          try {
              // Construim URL-ul API
              const query = new URLSearchParams();
              if (searchTerm) query.append('q', searchTerm);
              if (category) query.append('cat', category);
              if (location) query.append('loc', location);

              const res = await fetch(`/api/salons/search?${query.toString()}`);
              if (res.ok) {
                  setResults(await res.json());
              }
          } catch (error) {
              console.error("Search error", error);
          } finally {
              setLoading(false);
          }
      }
      fetchSalons();
  }, [searchTerm, category, location]);

  const pageTitle = category 
      ? `Rezultate: ${category.charAt(0).toUpperCase() + category.slice(1)}` 
      : searchTerm ? `Rezultate pentru "${searchTerm}"` : 'Toate Locațiile';

  return (
    <div className={styles.searchLayout}>
      
      <div style={{marginBottom: '15px'}}>
          <h1 style={{fontSize: '24px', color: '#1c2e40', marginBottom: '10px'}}>{pageTitle}</h1>
          {/* Filtrele rămân neschimbate vizual */}
          <div className={styles.filterBar}>
             <select className={styles.filterSelect}><option>Relevanță</option><option>Preț</option></select>
             <button className={styles.filterSelect} style={{background: '#f8f9fa'}}>Filtrează</button>
          </div>
      </div>

      <button className={styles.viewToggle} onClick={() => setShowMapMobile(!showMapMobile)}>
          {showMapMobile ? <><FaList /> Listă</> : <><FaMap /> Hartă</>}
      </button>

      <div className={styles.contentContainer}>
        
        {/* Lista Rezultate */}
        <div className={`${styles.resultsList} ${showMapMobile ? styles.hideMobile : ''}`}>
          {loading ? (
              <div style={{textAlign:'center', padding:'40px', color:'#007bff'}}><FaSpinner className="spin" /> Se caută...</div>
          ) : results.length === 0 ? (
              <div style={{padding: '20px', color: '#666'}}>
                  Nu am găsit rezultate pentru criteriile selectate. Încearcă o altă căutare.
              </div>
          ) : (
              results.map(salon => (
                <div key={salon.id} className={styles.salonCard}>
                  <img src={salon.image} alt={salon.title} className={styles.salonImage} />
                  
                  <div className={styles.salonDetails}>
                    <h2 className={styles.salonTitle}>{salon.title}</h2>
                    <div className={styles.salonMeta}>
                      <span style={{display:'flex', alignItems:'center', color:'#ffc107', fontWeight:'bold'}}>
                          <FaStar style={{marginRight:'5px'}}/> {salon.rating}
                      </span>
                      <span>({salon.reviews} recenzii)</span>
                    </div>
                    <div className={styles.salonMeta}>
                        <FaMapMarkerAlt /> {salon.address || 'Locație nespecificată'}
                    </div>
                    <div style={{fontSize: '13px', color: '#555', marginTop: '5px', background: '#f0f9ff', padding: '5px 10px', borderRadius: '4px', display: 'inline-block'}}>
                        {salon.serviceName}: <strong>{salon.price} RON</strong>
                    </div>
                  </div>
                  
                  <Link href={`/salon/${salon.slug}`}>
                    <button className={styles.bookButton}>Rezervă</button>
                  </Link>
                </div>
              ))
          )}
        </div>

        {/* Harta */}
        <div className={`${styles.mapContainer} ${showMapMobile ? styles.showMobile : ''}`}>
             <MapComponent salons={results} />
        </div>

      </div>
    </div>
  );
}