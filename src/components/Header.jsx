// /src/components/Header.jsx (COD COMPLET ACTUALIZAT - NAVIGARE EXTINSĂ)

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import AuthStatus from './AuthStatus';
import { FaBriefcase, FaSearch, FaQuestionCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        
        {/* 1. Logo */}
        <Link href="/" className={styles.logo}>
          BooksApp
        </Link>

        {/* 2. Navigare Centrală (NOU) */}
        <nav className={styles.navContainer}>
            <Link href="/" className={styles.navLink}>
                <FaSearch style={{marginRight: '5px'}} /> Explorare
            </Link>
            <Link href="/inregistrare-afacere" className={styles.navLink}>
                <FaBriefcase style={{marginRight: '5px'}} /> Pentru Afaceri
            </Link>
            <Link href="#" className={styles.navLink}>
                <FaQuestionCircle style={{marginRight: '5px'}} /> Ajutor
            </Link>
        </nav>
        
        {/* 3. Zona Utilizator (Login / Cont) */}
        <div className={styles.authContainer}>
          <AuthStatus />
        </div>

      </div>
    </header>
  );
};

export default Header;