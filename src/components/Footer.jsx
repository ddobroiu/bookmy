// /src/components/Footer.jsx (NOU)

'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Secțiunea Principală cu Coloane */}
        <div className={styles.grid}>
          
          {/* Coloana 1: Brand & Descriere */}
          <div className={styles.column}>
            <h3 className={styles.logo}>BooksApp</h3>
            <p className={styles.description}>
              Platforma ta completă pentru programări online. 
              Găsește servicii locale, verifică disponibilitatea și rezervă în câteva secunde, oriunde te-ai afla.
            </p>
          </div>

          {/* Coloana 2: Descoperă */}
          <div className={styles.column}>
            <h4>Descoperă</h4>
            <ul className={styles.linkList}>
              <li><Link href="/search?cat=beauty">Frumusețe & Spa</Link></li>
              <li><Link href="/search?cat=food">Restaurante</Link></li>
              <li><Link href="/search?cat=health">Sănătate</Link></li>
              <li><Link href="/search?cat=auto">Auto & Moto</Link></li>
              <li><Link href="/search?cat=fitness">Fitness</Link></li>
            </ul>
          </div>

          {/* Coloana 3: Pentru Afaceri */}
          <div className={styles.column}>
            <h4>Pentru Afaceri</h4>
            <ul className={styles.linkList}>
              <li><Link href="/inregistrare-afacere">Devino Partener</Link></li>
              <li><Link href="/login">Autentificare Admin</Link></li>
              <li><Link href="#">Prețuri și Abonamente</Link></li>
              <li><Link href="#">Succesul Partenerilor</Link></li>
            </ul>
          </div>

          {/* Coloana 4: Suport & Legal */}
          <div className={styles.column}>
            <h4>Suport & Legal</h4>
            <ul className={styles.linkList}>
              <li><Link href="#">Centru de Ajutor</Link></li>
              <li><Link href="#">Termeni și Condiții</Link></li>
              <li><Link href="#">Politica de Confidențialitate</Link></li>
              <li><Link href="#">Contactează-ne</Link></li>
            </ul>
          </div>

        </div>

        {/* Secțiunea de Jos (Copyright & Social) */}
        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} BooksApp. Toate drepturile rezervate.</p>
          
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}