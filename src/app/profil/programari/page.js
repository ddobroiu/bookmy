// /src/app/profil/programari/page.js (COD COMPLET ACTUALIZAT)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './programari.module.css';
import moment from 'moment';
import 'moment/locale/ro';
import { useRouter } from 'next/navigation';
import { FaCalendarCheck, FaTimesCircle, FaEdit, FaStore } from 'react-icons/fa';

moment.locale('ro');

const UserAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/appointments');
      if (!response.ok) {
        throw new Error('A apărut o eroare la preluarea programărilor.');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Sunteți sigur că doriți să anulați această programare? Această acțiune este ireversibilă.')) {
        return;
    }

    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' }) // Explicităm statusul
        });

        const data = await response.json();

        if (response.ok) {
          alert('Programarea a fost anulată cu succes.');
          fetchAppointments(); // Reîncarcă lista
        } else {
          alert(`Eroare: ${data.error || 'Nu s-a putut anula programarea.'}`);
        }
    } catch (err) {
        alert('A apărut o eroare de rețea.');
    }
  };

  const handleReschedule = (salonSlug) => {
      // Pentru editare, cel mai simplu flow este să trimitem utilizatorul la pagina salonului
      // să facă o programare nouă.
      router.push(`/salon/${salonSlug}`);
  };

  if (isLoading) return <div className={styles.loading}>Se încarcă programările...</div>;
  if (error) return <div className={styles.error}>Eroare: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Istoric Programări</h1>
      
      {appointments.length === 0 ? (
        <div className={styles.emptyState}>
            <p>Nu aveți nicio programare înregistrată.</p>
            <button className={styles.browseButton} onClick={() => router.push('/')}>
                Găsește un Salon
            </button>
        </div>
      ) : (
        <ul className={styles.appointmentsList}>
          {appointments.map((app) => {
            const isCancelled = app.status === 'CANCELLED';
            const isCompleted = app.status === 'COMPLETED' || new Date(app.end) < new Date();
            
            // Determinăm statusul vizual
            let statusText = 'Confirmată';
            let statusClass = styles.confirmed;
            if (isCancelled) {
                statusText = 'Anulată';
                statusClass = styles.cancelled;
            } else if (isCompleted) {
                statusText = 'Finalizată';
                statusClass = styles.completed;
            }

            return (
                <li key={app.id} className={`${styles.appointmentItem} ${isCancelled ? styles.itemCancelled : ''}`}>
                
                {/* Header Card */}
                <div className={styles.headerRow}>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                        {statusText}
                    </span>
                    <span className={styles.date}>
                        {moment(app.start).format('DD MMMM YYYY')}
                    </span>
                </div>

                {/* Body Card */}
                <div className={styles.contentRow}>
                    <div className={styles.mainInfo}>
                        <h3 className={styles.serviceTitle}>{app.title}</h3>
                        <div className={styles.salonInfo}>
                            <FaStore style={{marginRight: '5px', color: '#666'}}/>
                            <strong>{app.salon?.name || 'Salon Necunoscut'}</strong>
                        </div>
                        <div className={styles.timeInfo}>
                            <FaCalendarCheck style={{marginRight: '5px', color: '#007bff'}}/>
                            Ora: {moment(app.start).format('HH:mm')} - {moment(app.end).format('HH:mm')}
                        </div>
                        {app.staff && <p className={styles.staffName}>Specialist: {app.staff.name}</p>}
                    </div>
                </div>

                {/* Actions Footer */}
                <div className={styles.actionsRow}>
                    {!isCancelled && !isCompleted && (
                        <>
                            <button 
                                onClick={() => handleCancel(app.id)} 
                                className={styles.cancelButton}
                            >
                                <FaTimesCircle /> Anulează
                            </button>
                            {/* Editarea funcționează ca o trimitere către pagina salonului */}
                            {app.salon?.slug && (
                                <button 
                                    onClick={() => handleReschedule(app.salon.slug)} 
                                    className={styles.editButton}
                                >
                                    <FaEdit /> Reprogramează
                                </button>
                            )}
                        </>
                    )}
                    
                    {(isCancelled || isCompleted) && app.salon?.slug && (
                         <button 
                            onClick={() => handleReschedule(app.salon.slug)} 
                            className={styles.rebookButton}
                        >
                            Rezervă din nou
                        </button>
                    )}
                </div>
                </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserAppointmentsPage;