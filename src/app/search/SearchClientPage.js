// /app/search/SearchClientPage.js

'use client'; 

import React, { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './search.module.css';

// Componentă simplă pentru un card de salon
const SalonCard = ({ title, rating, services, price }) => {
  return (
    <div className={styles.salonCard}>
      {/* Imaginea va fi dinamică ulterior */}
      <div className={styles.salonImage}></div> 
      
      <div className={styles.salonDetails}>
        <h2 className={styles.salonTitle}>{title}</h2>
        <div className={styles.salonRating}>
          ⭐ {rating} (120 Recenzii)
        </div>
        <p>{services}</p>
        <p>Prețuri de la: <strong>{price} RON</strong></p>
      </div>
      
      <button className={styles.bookButton}>
        Programează-te
      </button>
    </div>
  );
};


// Componenta pentru bara laterală de filtre
const SearchSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedServices, setSelectedServices] = useState(
    searchParams.get('services') ? searchParams.get('services').split(',') : []
  );
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || '');

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleServiceChange = (serviceName) => {
    let newServices = selectedServices.includes(serviceName)
      ? selectedServices.filter(s => s !== serviceName)
      : [...selectedServices, serviceName];
      
    setSelectedServices(newServices);
    
    const servicesQuery = newServices.join(',');
    const newQueryString = createQueryString('services', servicesQuery);
    
    router.push(`/search?${newQueryString}`, { scroll: false }); 
  };
  
  const handlePriceChange = (priceRange) => {
      setSelectedPrice(priceRange);
      const newQueryString = createQueryString('price', priceRange);
      router.push(`/search?${newQueryString}`, { scroll: false });
  };


  return (
    <div className={styles.sidebar}>
      <h2>Filtre</h2>
      
      <div className={styles.filterGroup}>
        <h3>Serviciu</h3>
        <div className={styles.filterOption}>
          <input 
            type="checkbox" 
            id="tuns" 
            checked={selectedServices.includes('tuns')}
            onChange={() => handleServiceChange('tuns')}
          />
          <label htmlFor="tuns"> Tuns Bărbați</label>
        </div>
        <div className={styles.filterOption}>
          <input 
            type="checkbox" 
            id="manichiura" 
            checked={selectedServices.includes('manichiura')}
            onChange={() => handleServiceChange('manichiura')}
          />
          <label htmlFor="manichiura"> Manichiură Gel</label>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h3>Preț</h3>
        <div className={styles.filterOption}>
          <input 
            type="radio" 
            name="price" 
            id="low" 
            checked={selectedPrice === '0-50'}
            onChange={() => handlePriceChange('0-50')}
          />
          <label htmlFor="low"> 0 - 50 RON</label>
        </div>
        <div className={styles.filterOption}>
          <input 
            type="radio" 
            name="price" 
            id="medium" 
            checked={selectedPrice === '50-150'}
            onChange={() => handlePriceChange('50-150')}
          />
          <label htmlFor="medium"> 50 - 150 RON</label>
        </div>
      </div>
    </div>
  );
};


// Pagina principală de Căutare (componenta client)
export default function SearchClientPage() {
  
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q') || 'Toate Serviciile';
  const location = searchParams.get('loc') || 'Zona Selectată';
  const sortType = searchParams.get('sort') || 'Relevanță';

  const handleSortChange = (e) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', e.target.value);
      window.history.pushState(null, '', `?${params.toString()}`);
  };

  const results = [
    { id: 1, title: 'Salon de Lux Central', rating: 4.8, services: 'Tuns, Vopsit, Manichiură', price: 80 },
    { id: 2, title: 'Barber Shop Urban', rating: 4.5, services: 'Tuns, Bărbierit tradițional', price: 50 },
    { id: 3, title: 'Studio Nails & Beauty', rating: 4.9, services: 'Manichiură, Pedichiură', price: 75 },
    { id: 4, title: 'Salon Elena', rating: 4.2, services: 'Coafat, Make-up', price: 90 },
  ];
  
  const pageTitle = `${results.length} Saloane Găsite pentru "${searchTerm}" în ${location}`;

  return (
    <div className={styles.searchLayout}>
      
      <SearchSidebar />

      <div className={styles.mainContent}>
        
        <div className={styles.resultsHeader}>
          <h1>{pageTitle}</h1>
          <select 
            className={styles.sortSelect} 
            value={sortType} 
            onChange={handleSortChange}
          >
            <option value="Relevanță">Sortare după Relevanță</option>
            <option value="Rating">Sortare după Rating</option>
            <option value="Preț">Sortare după Preț</option>
          </select>
        </div>
        
        <div>
          {results.map(salon => (
            <SalonCard 
              key={salon.id}
              title={salon.title}
              rating={salon.rating}
              services={salon.services}
              price={salon.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
