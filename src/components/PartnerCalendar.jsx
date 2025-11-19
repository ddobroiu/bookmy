// /src/components/PartnerCalendar.jsx (COD COMPLET ACTUALIZAT)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ro';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaStar, FaUserCheck, FaClock, FaPhone, FaEnvelope } from 'react-icons/fa';

moment.locale('ro');
const localizer = momentLocalizer(moment);

// --- MODAL DETALII PROGRAMARE ---
const AppointmentModal = ({ event, onClose, onRate, onCancel, onApprove }) => {
    if (!event) return null;

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verificăm dacă programarea a trecut
    const isPast = new Date(event.end) < new Date();
    
    const handleRateSubmit = async () => {
        setIsSubmitting(true);
        await onRate(event.id, rating, comment);
        setIsSubmitting(false);
    };

    // Stiluri inline pentru modal
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    };
    const contentStyle = {
        backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '450px', maxWidth: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={contentStyle} onClick={e => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, color: '#1c2e40', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    Detalii Programare
                </h3>
                
                <div style={{ marginBottom: '25px', fontSize: '15px', lineHeight: '1.6' }}>
                    <div style={{marginBottom: '10px'}}>
                        <strong style={{color: '#555', display: 'block', fontSize: '12px', textTransform: 'uppercase'}}>Client</strong>
                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#333'}}>
                            {event.clientData?.name || event.clientName || 'Client Anonim'}
                        </div>
                        {/* Date contact client */}
                        {(event.clientData?.phoneNumber || event.clientPhone) && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#007bff', fontSize: '14px'}}>
                                <FaPhone size={12}/> {event.clientData?.phoneNumber || event.clientPhone}
                            </div>
                        )}
                    </div>

                    {/* Rating Client (dacă există cont) */}
                    {event.clientData && (
                        <div style={{marginBottom: '10px', background: '#fff8e1', padding: '8px', borderRadius: '6px', display: 'inline-block'}}>
                            <span style={{color: '#f39c12', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
                               Rating Client: <FaStar /> {event.clientData.averageClientRating?.toFixed(1) || 'Nou'} 
                               <span style={{color: '#888', fontWeight: 'normal', fontSize: '12px'}}>({event.clientData.clientReviewCount} recenzii)</span>
                            </span>
                        </div>
                    )}
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px'}}>
                        <div>
                            <strong style={{color: '#555', fontSize: '12px', textTransform: 'uppercase'}}>Serviciu</strong>
                            <div style={{fontWeight: '600'}}>{event.title}</div>
                        </div>
                        <div>
                            <strong style={{color: '#555', fontSize: '12px', textTransform: 'uppercase'}}>Preț</strong>
                            <div style={{fontWeight: '600', color: '#1aa858'}}>{event.price ? `${event.price} RON` : '-'}</div>
                        </div>
                    </div>

                    <div style={{marginTop: '10px'}}>
                        <strong style={{color: '#555', fontSize: '12px', textTransform: 'uppercase'}}>Data și Ora</strong>
                        <div style={{fontWeight: '600'}}>{moment(event.start).format('DD MMMM YYYY')}</div>
                        <div style={{color: '#666'}}>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</div>
                    </div>
                    
                    <div style={{marginTop: '15px'}}>
                         <strong style={{color: '#555', fontSize: '12px', textTransform: 'uppercase'}}>Status</strong> <br/>
                         <span style={{
                             fontWeight:'bold', 
                             padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                             background: event.status === 'PENDING' ? '#fff3cd' : event.status === 'CONFIRMED' ? '#d4edda' : '#f8d7da',
                             color: event.status === 'PENDING' ? '#856404' : event.status === 'CONFIRMED' ? '#155724' : '#721c24'
                         }}>
                            {event.status === 'PENDING' ? 'ÎN AȘTEPTARE' : event.status}
                         </span>
                    </div>
                </div>

                {/* ZONA ACȚIUNI: APROBARE */}
                {event.status === 'PENDING' && (
                    <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                        <p style={{fontWeight:'bold', color:'#856404', marginTop:0, display:'flex', alignItems:'center', gap:'5px', fontSize: '14px'}}>
                            <FaClock /> Această programare necesită aprobare!
                        </p>
                        <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                            <button 
                                onClick={() => onApprove(event.id)} 
                                style={{background:'#1aa858', color:'white', flex:1, border:'none', padding:'10px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}
                            >
                                ✅ Acceptă
                            </button>
                            <button 
                                onClick={() => onCancel(event)} 
                                style={{background:'#e64c3c', color:'white', flex:1, border:'none', padding:'10px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}
                            >
                                ❌ Refuză
                            </button>
                        </div>
                    </div>
                )}

                {/* ZONA ACȚIUNI: RATING (Doar după finalizare) */}
                {isPast && !event.hasBeenReviewed && event.clientData && event.status === 'CONFIRMED' && (
                    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed #ddd' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>Notează comportamentul clientului</h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}>
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
                            placeholder="Mențiuni interne (ex: a întârziat)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px', fontSize: '13px'}}
                        />
                        <button 
                            onClick={handleRateSubmit} 
                            disabled={isSubmitting}
                            style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', width: '100%', cursor: 'pointer', fontWeight: '600' }}
                        >
                            {isSubmitting ? 'Se salvează...' : 'Salvează Nota'}
                        </button>
                    </div>
                )}

                {event.hasBeenReviewed && (
                    <div style={{ color: '#1aa858', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                        <FaUserCheck /> Ai evaluat deja acest client.
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                     {/* Buton Anulare pentru programări deja confirmate */}
                     {event.status === 'CONFIRMED' && !isPast && (
                        <button onClick={() => onCancel(event)} style={{ background: 'white', border: '1px solid #e64c3c', color: '#e64c3c', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                            Anulează Programarea
                        </button>
                     )}
                     <div style={{flex: 1}}></div> {/* Spacer */}
                    <button onClick={onClose} style={{ background: '#f0f0f0', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', color: '#333', fontWeight: '600' }}>
                        Închide
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTA PRINCIPALĂ ---
export default function PartnerCalendar({ staffId }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
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

  // Handler pentru deschidere modal
  const handleSelectEvent = (event) => {
      setSelectedEvent(event);
  };

  // 1. Aprobare Programare
  const handleApprove = async (id) => {
      try {
          const response = await fetch(`/api/appointments/${id}`, {
              method: 'PATCH', // Asigură-te că API-ul suportă PATCH pentru status
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'CONFIRMED' }) // Trimitem status explicit dacă API-ul e generic, sau creăm rută dedicată
          });
          
          // Notă: Ruta /api/appointments/[id] trebuie să permită update la status
          if (response.ok) {
            alert("Programare confirmată! Clientul a fost notificat.");
            setSelectedEvent(null);
            fetchAppointments();
          } else {
            alert("Eroare la aprobare.");
          }
      } catch (e) {
          console.error(e);
          alert("Eroare de rețea.");
      }
  };

  // 2. Anulare / Refuz
  const handleCancelEvent = async (event) => {
    const actionText = event.status === 'PENDING' ? 'refuzați' : 'anulați';
    if (window.confirm(`Sigur doriți să ${actionText} programarea lui ${event.title}?`)) {
      try {
        const response = await fetch(`/api/appointments/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' }),
        });

        if (response.ok) {
          alert('Acțiune efectuată cu succes.');
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

  // 3. Rating Client
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
              fetchAppointments(); 
          } else {
              const data = await response.json();
              alert(data.error || 'Eroare');
          }
      } catch (e) {
          alert('Eroare de rețea');
      }
  };

  // Stiluri evenimente în calendar
  const eventStyleGetter = (event) => {
    let backgroundColor = '#007bff'; // Default Blue
    
    // Logică culori
    if (event.status === 'PENDING') {
        backgroundColor = '#f39c12'; // Portocaliu (Atenție!)
    } else if (event.status === 'CANCELLED') {
        backgroundColor = '#a9a9a9'; // Gri
    } else if (event.clientData && event.clientData.averageClientRating < 3 && event.clientData.averageClientRating > 0) {
        backgroundColor = '#e74c3c'; // Roșu (Client Problematic)
    }

    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'white',
      border: '0px',
      display: 'block',
      opacity: event.status === 'CANCELLED' ? 0.6 : 1
    };
    return { style };
  };

  if (isLoading) {
    return <div style={{height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: '12px'}}>
        <div style={{textAlign: 'center', color: '#666'}}>Se încarcă calendarul...</div>
    </div>;
  }

  return (
    <div style={{ height: '700px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
        min={new Date(0, 0, 0, 8, 0, 0)} // Începe la 08:00
        max={new Date(0, 0, 0, 22, 0, 0)} // Se termină la 22:00
      />

      {/* Modalul */}
      {selectedEvent && (
          <AppointmentModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)}
            onRate={handleRateClient}
            onCancel={handleCancelEvent}
            onApprove={handleApprove}
          />
      )}
    </div>
  );
}