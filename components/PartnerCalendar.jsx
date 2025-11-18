// /components/PartnerCalendar.jsx (COD COMPLET CU LOGICĂ DE ADAUGARE EVENIMENT)

'use client';

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Asigură-te că moment.js are formatarea românească pentru afișaj corect
// Deși nu am instalat pachetul moment-with-locales, setările implicite sunt deseori suficiente
moment.locale('ro'); 
const localizer = momentLocalizer(moment);

// Date de exemplu (deocamdată goale)
const initialEvents = [
  {
    title: 'Pauză de Prânz (Blocat)',
    start: moment().startOf('day').add(13, 'hours').toDate(),
    end: moment().startOf('day').add(14, 'hours').toDate(),
    isBlock: true, // Tip de eveniment
  },
  {
    title: 'Programare: Client X (Manichiură)',
    start: moment().startOf('day').add(15, 'hours').toDate(),
    end: moment().startOf('day').add(16, 'hours').toDate(),
    isBlock: false,
  },
];

export default function PartnerCalendar() {
  const [events, setEvents] = useState(initialEvents);

  const handleSelectSlot = ({ start, end }) => {
    // 1. Solicită utilizatorului informații
    const title = window.prompt(
      'Ce tip de eveniment dorești să adaugi?\n(Ex: Pauză, Programare, etc.)'
    );

    if (title) {
      const isBlock = title.toLowerCase().includes('pauză') || title.toLowerCase().includes('blocat');
      
      // 2. Adaugă noul eveniment la lista de evenimente
      const newEvent = {
        start,
        end,
        title,
        isBlock,
        id: events.length + 1, // ID unic
      };
      
      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // ********* AICI SE VA FACE APELUL API PENTRU SALVAREA EVENIMENTULUI ÎN BAZA DE DATE *********
      console.log('Eveniment salvat (simulat):', newEvent);
    }
  };
  
  // Stilizarea Evenimentelor (pentru a diferenția Programările de Timpul Blocat)
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isBlock ? '#e64c3c' : '#007bff', // Roșu pentru blocaj, Albastru pentru programare
      borderRadius: '5px',
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };


  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week" 
        selectable={true}
        views={['month', 'week', 'day']} 
        style={{ height: '100%' }}
        messages={{
          next: 'Urm.',
          previous: 'Anter.',
          today: 'Azi',
          month: 'Lună',
          week: 'Săpt.',
          day: 'Zi',
          showMore: (total) => `+ ${total} alte`,
        }}
        // Funcții pentru interacțiune
        onSelectEvent={(event) => alert(`${event.title} [${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}]`)}
        onSelectSlot={handleSelectSlot} // Apelăm funcția de adăugare eveniment
        eventPropGetter={eventStyleGetter} // Aplicăm stiluri diferite
      />
    </div>
  );
}