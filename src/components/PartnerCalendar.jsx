// /components/PartnerCalendar.jsx (COD COMPLET CU FILTRU STAFF)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

moment.locale('ro'); 
const localizer = momentLocalizer(moment);

// Datele sunt filtrate în funcție de staffId
export default function PartnerCalendar({ staffId }) { 
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. ÎNCĂRCAREA PROGRAMĂRILOR (Fetch from API)
  const fetchAppointments = useCallback(async () => {
    try {
        setIsLoading(true);
        // În realitate: URL-ul API ar include un parametru staffId=
        const response = await fetch('/api/appointments'); 
        
        if (response.ok) {
            const data = await response.json();
            
            // LOGICA DE FILTRARE (SIMULATĂ)
            let filteredEvents = data;
            if (staffId && staffId !== 'all') {
                // În realitate, serverul ar filtra, dar aici facem o filtrare simplă pe client
                filteredEvents = data.filter(event => event.staffId === staffId); 
            }
            
            const formattedEvents = filteredEvents.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
            setEvents(formattedEvents);
        }
    } catch (error) {
        console.error("Eroare la încărcarea programărilor:", error);
    } finally {
        setIsLoading(false);
    }
  }, [staffId]); // Reîncarcă la schimbarea staffId

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  // 2. SALVAREA PROGRAMĂRILOR (Logica POST rămâne neschimbată, dar ar trebui să includă staffId)
  const handleSelectSlot = async ({ start, end }) => {
    // ... Logica POST (simulată) ar fi aici ...
    const title = window.prompt('Ce tip de eveniment dorești să adaugi?');
    if (title) {
        // În loc de prompt, ai un formular care colectează staffId
        const isBlock = title.toLowerCase().includes('pauză') || title.toLowerCase().includes('blocat');
        alert(`Simulare: Eveniment salvat pentru ${staffId === 'all' ? 'Toți' : 'Angajatul cu ID ' + staffId}`);
        
        // După salvarea reală în API, reîncărcăm:
        fetchAppointments(); 
    }
  };
  
  // Stilizarea Evenimentelor
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isBlock ? '#e64c3c' : '#007bff', 
      borderRadius: '5px',
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };


  if (isLoading) {
      return <div style={{height: '700px', textAlign: 'center', padding: '50px'}}>Se încarcă calendarul...</div>;
  }

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
          next: 'Urm.', previous: 'Anter.', today: 'Azi', month: 'Lună', week: 'Săpt.', day: 'Zi', showMore: (total) => `+ ${total} alte`,
        }}
        onSelectSlot={handleSelectSlot} 
        eventPropGetter={eventStyleGetter} 
      />
    </div>
  );
}