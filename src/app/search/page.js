// /app/search/page.js
import React, { Suspense } from 'react';
import SearchClientPage from './SearchClientPage';
import styles from './search.module.css';

// O componentă de încărcare simplă
function Loading() {
  return <div className={styles.loading}>Se încarcă...</div>;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchClientPage />
    </Suspense>
  );
}
