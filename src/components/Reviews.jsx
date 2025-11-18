// /src/components/Reviews.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './Reviews.module.css';

// Componenta pentru afișarea steluțelor (atât pentru afișare, cât și pentru input)
const StarRating = ({ rating, setRating, isInteractive }) => {
    const stars = Array(5).fill(0);

    const handleClick = (newRating) => {
        if (isInteractive) {
            setRating(newRating);
        }
    };

    return (
        <div className={styles.starRating}>
            {stars.map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={starValue}
                        className={isInteractive ? styles.starInteractive : styles.starDisplay}
                        color={starValue <= rating ? '#ffc107' : '#e4e5e9'}
                        onClick={() => handleClick(starValue)}
                    />
                );
            })}
        </div>
    );
};

// Componenta principală de Recenzii
export default function Reviews({ salonId }) {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State pentru formularul de adăugare
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userAppointments, setUserAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState('');
    const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });

    // Funcție pentru a prelua recenziile
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?salonId=${salonId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                setError('Nu am putut încărca recenziile.');
            }
        } catch (err) {
            setError('Eroare de rețea. Încearcă din nou.');
        } finally {
            setIsLoading(false);
        }
    };

    // Funcție pentru a prelua programările finalizate ale utilizatorului
    const fetchUserAppointments = async () => {
        try {
            // Acest endpoint trebuie să returneze programările finalizate ale user-ului logat
            const response = await fetch('/api/user/appointments?status=completed');
            if (response.ok) {
                const data = await response.json();
                // Filtrăm programările care sunt pentru salonul curent
                const relevantAppointments = data.filter(app => app.salonId === salonId);
                setUserAppointments(relevantAppointments);
            }
        } catch (err) {
            console.error('Nu am putut prelua programările:', err);
        }
    };

    useEffect(() => {
        if (salonId) {
            fetchReviews();
            fetchUserAppointments(); // Preluăm și programările pentru formular
        }
    }, [salonId]);

    // Handler pentru trimiterea formularului
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ message: 'Se trimite recenzia...', isError: false });

        if (rating === 0 || !selectedAppointment) {
            setSubmitStatus({ message: 'Te rugăm să selectezi o programare și să acorzi un rating.', isError: true });
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    salonId,
                    appointmentId: selectedAppointment,
                    rating,
                    comment,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus({ message: 'Recenzie adăugată cu succes!', isError: false });
                setRating(0);
                setComment('');
                setSelectedAppointment('');
                fetchReviews(); // Re-încarcă lista de recenzii
            } else {
                setSubmitStatus({ message: result.error || 'A apărut o eroare.', isError: true });
            }
        } catch (err) {
            setSubmitStatus({ message: 'Eroare de rețea la trimitere.', isError: true });
        }
    };

    return (
        <div className={styles.reviewsContainer}>
            <h2>Recenzii</h2>

            {/* Secțiunea de adăugare recenzie */}
            <div className={styles.addReviewSection}>
                <h3>Lasă o recenzie</h3>
                {userAppointments.length > 0 ? (
                    <form onSubmit={handleSubmit} className={styles.reviewForm}>
                        <div className={styles.formGroup}>
                            <label>Selectează programarea pentru care lași recenzia:</label>
                            <select
                                value={selectedAppointment}
                                onChange={(e) => setSelectedAppointment(e.target.value)}
                                required
                            >
                                <option value="">Alege o programare</option>
                                {userAppointments.map(app => (
                                    <option key={app.id} value={app.id}>
                                        {app.title} - {new Date(app.start).toLocaleDateString('ro-RO')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Rating-ul tău:</label>
                            <StarRating rating={rating} setRating={setRating} isInteractive={true} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="comment">Comentariul tău (opțional):</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Spune-ne mai multe despre experiența ta..."
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Trimite Recenzia</button>
                        {submitStatus.message && (
                            <p className={submitStatus.isError ? styles.errorMessage : styles.successMessage}>
                                {submitStatus.message}
                            </p>
                        )}
                    </form>
                ) : (
                    <p className={styles.infoText}>
                        Trebuie să ai o programare finalizată la acest salon pentru a putea lăsa o recenzie.
                    </p>
                )}
            </div>

            {/* Lista de recenzii existente */}
            {isLoading ? (
                <p>Se încarcă recenziile...</p>
            ) : error ? (
                <p className={styles.errorMessage}>{error}</p>
            ) : reviews.length > 0 ? (
                <div className={styles.reviewsList}>
                    {reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.reviewUser}>{review.user.email.split('@')[0]}</span>
                                <span className={styles.reviewDate}>
                                    {new Date(review.createdAt).toLocaleDateString('ro-RO')}
                                </span>
                            </div>
                            <StarRating rating={review.rating} isInteractive={false} />
                            <p className={styles.reviewComment}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Acest salon nu are încă nicio recenzie. Fii primul care lasă una!</p>
            )}
        </div>
    );
}