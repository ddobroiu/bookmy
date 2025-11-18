// src/app/search/loading.js
import styles from './search.module.css';

export default function Loading() {
  return (
    <div className={styles.searchLayout}>
      <div className={styles.sidebar}>
        <h2>Filtre</h2>
        <div className={styles.filterGroup}>
          <h3>Serviciu</h3>
        </div>
        <div className={styles.filterGroup}>
          <h3>Preț</h3>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.resultsHeader}>
          <h1>Se încarcă rezultatele...</h1>
        </div>
        <div>
          {/* Aici se pot adăuga componente "schelet" pentru un efect vizual mai bun */}
        </div>
      </div>
    </div>
  );
}
