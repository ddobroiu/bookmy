// /components/Header.jsx (COD COMPLET ACTUALIZAT CU RUTE NOI)

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css'; 

const Header = () => {
  return (
    <header className={`${styles.primaryColor} ${styles.header}`}>
      <div className={styles.headerInner}>
        
        <Link href="/" className={styles.logo}>
          BooksApp
        </Link>
        
        <div>
          {/* Buton Logare - Duce la pagina de Logare */}
          <Link href="/login" passHref legacyBehavior>
            <button className={styles.loginBtn}>
              Logare
            </button>
          </Link>

          {/* Buton Înregistrare - Duce la pagina de Înregistrare Afacere (promovăm parteneriatul) */}
          <Link href="/inregistrare-afacere" passHref legacyBehavior>
            <button className={styles.registerBtn}>
              Înregistrează-te
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;