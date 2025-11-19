// /src/components/AIChatBooking.jsx (ACTUALIZAT)

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaWhatsapp, FaSpinner } from 'react-icons/fa';
import styles from './AIChat.module.css';

// Primim salonId ca prop (dacă e pe pagina unui salon)
export default function AIChatBooking({ salonId }) {
    const [messages, setMessages] = useState([
        { id: 1, text: salonId ? "Salut! Sunt asistentul acestui salon. Cu ce te pot ajuta?" : "Salut! Caut un serviciu anume?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageAreaRef = useRef(null);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (textOverride) => {
        const textToSend = textOverride || input.trim();
        if (!textToSend) return;

        const userMessage = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Trimitem și salonId la server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: textToSend,
                    salonId: salonId, // IMPORTANT: Trimitem ID-ul salonului
                    guestInfo: { name: 'Vizitator Site' } // Putem cere numele în viitor
                })
            });

            const data = await response.json();

            const botMessage = { 
                id: Date.now() + 1, 
                text: data.text, 
                sender: 'bot',
                actions: data.actions 
            };
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            setMessages((prev) => [...prev, { id: Date.now(), text: "Eroare rețea.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ... restul codului (render) rămâne la fel ...
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className={styles.chatContainer}>
             <div className={styles.chatHeader}>
                <FaRobot /> {salonId ? 'Chat Salon' : 'Asistent Virtual'}
            </div>
            
            <div className={styles.messageArea} ref={messageAreaRef}>
                {messages.map(msg => (
                    <div key={msg.id} style={{display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'}}>
                        <div className={`${styles.message} ${msg.sender === 'bot' ? styles.botMessage : styles.userMessage}`}>
                            {msg.text}
                        </div>
                        {msg.actions && (
                            <div style={{display: 'flex', gap: '5px', marginTop: '-10px', marginBottom: '10px', flexWrap: 'wrap'}}>
                                {msg.actions.map(action => (
                                    <button key={action} onClick={() => handleSend(action)} style={{background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', cursor: 'pointer'}}>
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && <div className={`${styles.message} ${styles.botMessage}`} style={{fontStyle: 'italic', color: '#888'}}><FaSpinner className="spin" /> Scrie...</div>}
            </div>

            <div className={styles.inputArea}>
                <input type="text" className={styles.chatInput} placeholder="Scrie un mesaj..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isTyping} />
                <button className={styles.sendButton} onClick={() => handleSend()} disabled={isTyping}><FaPaperPlane /></button>
            </div>
            
             <p style={{textAlign: 'center', fontSize: '11px', padding: '8px', background: '#f9f9f9', borderTop: '1px solid #eee', margin: 0}}>
                <a href="#" style={{color: '#25d366', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                    <FaWhatsapp size={14}/> Continuă pe WhatsApp
                </a>
            </p>
        </div>
    );
}