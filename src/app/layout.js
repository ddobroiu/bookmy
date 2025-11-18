// /app/layout.js (COD COMPLET ACTUALIZAT CU TOAST PROVIDER)

import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import '../globals.css'; 
import Header from '../components/Header'; 
import { ToastProvider } from '../context/ToastContext'; // Import NOU

export const metadata = {
  title: 'BooksApp Clone - Găsește-ți Programarea',
  description: 'Un clon Next.js al platformei de programări online Booksy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        {/* Încapsulăm aplicația în ToastProvider */}
        <ToastProvider>
          <Header />
          <main>
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}