// /src/app/layout.js (COD COMPLET FINAL ȘI LOGIC CORECT)

import 'react-big-calendar/lib/css/react-big-calendar.css'; 

// CORECTAT: Ieși din app (..), găsește globals.css
import '../globals.css'; 

// CORECTAT: Ieși din app (..), intră în components
import Header from '../components/Header'; 
// CORECTAT: Ieși din app (..), intră în context
import { ToastProvider } from '../context/ToastContext'; 

export const metadata = {
  title: 'BooksApp Clone - Găsește-ți Programarea',
  description: 'Un clon Next.js al platformei de programări online Booksy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
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