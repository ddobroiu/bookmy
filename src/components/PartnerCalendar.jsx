// /src/components/PartnerCalendar.jsx (ACTUALIZAT CU RATING CLIENT)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ro';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaStar, FaUserCheck } from 'react-icons/fa'; // Import iconițe

moment.locale('ro');
const localizer = momentLocalizer(moment);

// Componentă simplă Modal pentru Detalii & Rating
const AppointmentModal = ({ event, onClose, onRate, onCancel }) => {
    if (!event) return null;

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verificăm dacă programarea a trecut pentru a permite rating
    const isPast = new Date(event.end) < new Date();
    
    const handleRateSubmit = async () => {
        setIsSubmitting(true);
        await onRate(event.id, rating, comment);
        setIsSubmitting(false);
    };

    const modalStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    };
    const contentStyle = {
        backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={e => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, color: '#1c2e40' }}>Detalii Programare</h3>
                
                <div style={{ marginBottom: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                    <p><strong>Client:</strong> {event.clientData?.name || 'Anonim'}</p>
                    
                    {/* Afișăm Rating-ul Clientului */}
                    {event.clientData && (
                        <p style={{color: '#f39c12', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
                           Rating Client: <FaStar style={{marginRight:'5px'}}/> {event.clientData.averageClientRating?.toFixed(1) || 'N/A'} 
                           <span style={{color: '#888', fontWeight: 'normal', marginLeft: '5px'}}>({event.clientData.clientReviewCount} recenzii)</span>
                        </p>
                    )}
                    
                    <p><strong>Serviciu:</strong> {event.title}</p>
                    <p><strong>Data:</strong> {moment(event.start).format('LLL')}</p>
                </div>

                {/* Zona de Rating (Doar dacă a trecut timpul și nu a fost deja evaluat) */}
                {isPast && !event.hasBeenReviewed && event.clientData && (
                    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed #ccc' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Notează Clientul</h4>
                        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <FaStar 
                                    key={star} 
                                    size={24} 
                                    color={star <= rating ? '#ffc107' : '#e4e5e9'} 
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <textarea 
                            placeholder="Comentariu (opțional)..." 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px' }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button 
                            onClick={handleRateSubmit} 
                            disabled={isSubmitting}
                            style={{ background: '#1aa858', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                        >
                            {isSubmitting ? 'Se trimite...' : 'Salvează Nota'}
                        </button>
                    </div>
                )}

                {event.hasBeenReviewed && (
                    <div style={{ color: '#1aa858', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaUserCheck /> Ai evaluat deja acest client.
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={() => onCancel(event)} style={{ background: 'none', border: '1px solid #e64c3c', color: '#e64c3c', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                        Anulează Programarea
                    </button>
                    <button onClick={onClose} style={{ background: '#ddd', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                        Închide
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componenta Principală Calendar
export default function PartnerCalendar({ staffId }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Pentru modal
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = staffId && staffId !== 'all' ? `/api/appointments?staffId=${staffId}` : '/api/appointments';
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

  // Handler pentru click pe event -> Deschide Modal
  const handleSelectEvent = (event) => {
      setSelectedEvent(event);
  };

  // Handler Rating
  const handleRateClient = async (appointmentId, rating, comment) => {
      try {
          const response = await fetch('/api/partner/client-reviews', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ appointmentId, rating, comment })
          });

          if (response.ok) {
              alert('Nota a fost salvată!');
              setSelectedEvent(null);
              fetchAppointments(); // Reîncărcăm pentru a actualiza statusul
          } else {
              const data = await response.json();
              alert(data.error || 'Eroare');
          }
      } catch (e) {
          alert('Eroare de rețea');
      }
  };

  // Handler Anulare (existent)
  const handleCancelEvent = async (event) => {
    if (window.confirm(`Doriți să anulați programarea lui ${event.title}?`)) {
      try {
        const response = await fetch(`/api/appointments/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' }),
        });

        if (response.ok) {
          alert('Programarea a fost anulată.');
          setSelectedEvent(null);
          fetchAppointments(); 
        } else {
          alert('Eroare la anulare.');
        }
      } catch (error) {
        alert('A apărut o eroare.');
      }
    }
  };

  const eventStyleGetter = (event) => {
    // Culoare în funcție de nota clientului (Opțional)
    let backgroundColor = '#007bff';
    if (event.clientData && event.clientData.averageClientRating < 3 && event.clientData.averageClientRating > 0) {
        backgroundColor = '#e67e22'; // Portocaliu pentru clienți problematici
    }

    if (event.isBlock) backgroundColor = '#e64c3c';
    if (event.status === 'CANCELLED') backgroundColor = '#a9a9a9';

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        color: 'white',
        border: '0px',
        display: 'block'
      }
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

      {/* Modalul Personalizat */}
      {selectedEvent && (
          <AppointmentModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)}
            onRate={handleRateClient}
            onCancel={handleCancelEvent}
          />
      )}
    </div>
  );
}