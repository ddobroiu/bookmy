// /components/PartnerCalendar.jsx (COD COMPLET CU CONECTARE API)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

moment.locale('ro'); 
const localizer = momentLocalizer(moment);

export default function PartnerCalendar() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  // 1. ÎNCĂRCAREA PROGRAMĂRILOR (Fetch from API)
  const fetchAppointments = useCallback(async () => {
    try {
        setIsLoading(true);
        const response = await fetch('/api/appointments');
        if (response.ok) {
            const data = await response.json();
            // Asigurăm că start/end sunt obiecte Date
            const formattedEvents = data.map(event => ({
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
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  // 2. SALVAREA PROGRAMĂRILOR (Post to API)
  const handleSelectSlot = async ({ start, end }) => {
    const title = window.prompt(
      'Ce tip de eveniment dorești să adaugi?\n(Ex: Pauză, Programare Client X, etc.)'
    );

    if (title) {
      const isBlock = title.toLowerCase().includes('pauză') || title.toLowerCase().includes('blocat');
      
      const newEvent = {
        title,
        start: start.toISOString(), // Trimitem ca string ISO
        end: end.toISOString(),
        isBlock,
      };

      try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent),
        });

        if (response.ok) {
            // Dacă salvarea este OK, reîncărcăm calendarul
            fetchAppointments(); 
        } else {
            alert('Eroare la salvarea programării!');
        }
      } catch (error) {
          alert('Eroare de rețea la salvare.');
      }
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
          next: 'Urm.',
          previous: 'Anter.',
          today: 'Azi',
          month: 'Lună',
          week: 'Săpt.',
          day: 'Zi',
          showMore: (total) => `+ ${total} alte`,
        }}
        onSelectEvent={(event) => alert(`${event.title} [${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}]`)}
        onSelectSlot={handleSelectSlot} 
        eventPropGetter={eventStyleGetter} 
      />
    </div>
  );
}