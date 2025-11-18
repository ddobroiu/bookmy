// /app/layout.js (COD COMPLET ACTUALIZAT CU STILURI CALENDAR)

// Importăm stilurile pentru Calendar (React Big Calendar)
import 'react-big-calendar/lib/css/react-big-calendar.css'; 

// CALE CORECTATĂ: Ieșim din directorul /app pentru a ajunge la globals.css 
// (presupunând că a fost mutat la rădăcina proiectului)
import '../globals.css'; 

// Calea către Header (componentă la același nivel cu /app)
import Header from '../components/Header'; 

export const metadata = {
  title: 'BooksApp Clone - Găsește-ți Programarea',
  description: 'Un clon Next.js al platformei de programări online Booksy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}