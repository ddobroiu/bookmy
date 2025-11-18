// /components/Header.jsx (COD COMPLET ACTUALIZAT CU AUTHSTATUS)

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import AuthStatus from './AuthStatus'; // Import NOU

const Header = () => {
  return (
    <header className={`${styles.primaryColor} ${styles.header}`}>
      <div className={styles.headerInner}>
        
        <Link href="/" className={styles.logo}>
          BooksApp
        </Link>
        
        {/* Aici injectăm componenta Client care gestionează starea logării */}
        <div>
          <AuthStatus />
        </div>

      </div>
    </header>
  );
};

export default Header;