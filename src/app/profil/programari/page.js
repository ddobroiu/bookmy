'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './programari.module.css';
import moment from 'moment';
import 'moment/locale/ro';

moment.locale('ro');

const UserAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (window.confirm('Sunteți sigur că doriți să anulați această programare?')) {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'PATCH',
        });

        if (response.ok) {
          alert('Programarea a fost anulată.');
          fetchAppointments();
        } else {
          const { error } = await response.json();
          alert(`Eroare: ${error}`);
        }
      } catch (err) {
        alert('A apărut o eroare la anularea programării.');
      }
    }
  };

  if (isLoading) return <p>Se încarcă programările...</p>;
  if (error) return <p>Eroare: {error}</p>;

  return (
    <div className={styles.container}>
      <h1>Programările Mele</h1>
      {appointments.length === 0 ? (
        <p>Nu aveți nicio programare viitoare.</p>
      ) : (
        <ul className={styles.appointmentsList}>
          {appointments.map((app) => (
            <li key={app.id} className={`${styles.appointmentItem} ${app.status === 'CANCELLED' ? styles.cancelled : ''}`}>
              <div className={styles.salonInfo}>
                <span className={styles.salonName}>{app.salon.name}</span>
                <span className={styles.staffName}>cu {app.staff.name}</span>
              </div>
              <div className={styles.timeInfo}>
                {moment(app.start).format('LLLL')}
              </div>
              <div className={styles.status}>
                Status: {app.status}
              </div>
              {app.status !== 'CANCELLED' && (
                <button onClick={() => handleCancel(app.id)} className={styles.cancelButton}>
                  Anulează
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserAppointmentsPage;
