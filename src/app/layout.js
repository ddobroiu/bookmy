// /src/app/layout.js (COD COMPLET ACTUALIZAT)

import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import '../globals.css'; 

import Header from '../components/Header'; 
import Footer from '../components/Footer'; // Importăm Footer-ul
import { ToastProvider } from '../context/ToastContext'; 

export const metadata = {
  title: 'BooksApp - Hub-ul Tău de Rezervări',
  description: 'Găsește și rezervă servicii locale: saloane, restaurante, medici și multe altele.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      {/* Flex layout pentru sticky footer */}
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ToastProvider>
          <Header />
          
          {/* Main ocupă tot spațiul rămas */}
          <main style={{ flex: 1 }}>
            {children}
          </main>
          
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}