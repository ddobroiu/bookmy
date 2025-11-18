'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ro';
import 'react-big-calendar/lib/css/react-big-calendar.css';


moment.locale('ro');
const localizer = momentLocalizer(moment);

export default function PartnerCalendar({ staffId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = staffId ? `/api/appointments?staffId=${staffId}` : '/api/appointments';
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
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
  }, [staffId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSelectEvent = async (event) => {
    if (event.status === 'CANCELLED') {
      alert('Această programare este deja anulată.');
      return;
    }
    
    const confirmCancel = window.confirm(`Doriți să anulați această programare?\n\n${event.title}\nDe la: ${moment(event.start).format('LLL')}\nPână la: ${moment(event.end).format('LLL')}`);
    
    if (confirmCancel) {
      try {
        const response = await fetch(`/api/appointments/${event.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'CANCELLED' }),
        });

        if (response.ok) {
          alert('Programarea a fost anulată cu succes.');
          fetchAppointments(); // Reîncarcă programările
        } else {
          const { error } = await response.json();
          alert(`Eroare la anulare: ${error}`);
        }
      } catch (error) {
        console.error('Eroare la anularea programării:', error);
        alert('A apărut o eroare la anularea programării.');
      }
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#007bff';
    if (event.isBlock) {
      backgroundColor = '#e64c3c';
    } else if (event.status === 'CANCELLED') {
      backgroundColor = '#a9a9a9'; // Gri pentru anulat
    }

    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'white',
      border: '0px',
      display: 'block',
      textDecoration: event.status === 'CANCELLED' ? 'line-through' : 'none',
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
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}