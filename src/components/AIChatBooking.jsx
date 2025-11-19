// /components/AIChatBooking.jsx (ACTUALIZAT PENTRU HOMEPAGE & WHATSAPP PREP)

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import styles from './AIChat.module.css';

// Simulare Logică AI (Aceasta va fi "creierul" și pentru WhatsApp ulterior)
const getAIResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('buna') || msg.includes('salut')) {
        return "Salut! Sunt BooksApp AI. Spune-mi ce cauți (ex: tuns, pizza, dentist) și te ajut să găsești locul perfect!";
    }
    if (msg.includes('tund') || msg.includes('tuns') || msg.includes('frizerie')) {
        return "Am găsit câteva frizerii de top în zona ta. Vrei să îți arăt lista sau să fac o programare rapidă la 'Barber Shop Urban'?";
    }
    if (msg.includes('mancare') || msg.includes('restaurant') || msg.includes('pizza')) {
        return "Sună delicios! Avem restaurante precum 'Sky View' sau pizzerii locale. Pentru câte persoane dorești masă?";
    }
    if (msg.includes('programare') || msg.includes('rezerva')) {
        return "Sigur. Pentru ce dată și oră te interesează?";
    }
    if (msg.includes('maine') || msg.includes('azi')) {
        return "Am verificat disponibilitatea. Avem loc liber la ora 14:00 sau 16:30. Ce preferi?";
    }
    return "Încă învăț despre asta. Poți încerca să cauți o categorie specifică (ex: Auto, Medical, Beauty).";
};

export default function AIChatBooking() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Salut! 👋 Cauți un serviciu anume? Scrie-mi aici și te ajut să rezervi rapid.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messageAreaRef = useRef(null);

    // Auto-scroll la mesajul nou
    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        // Simulăm "typing..."
        setTimeout(() => {
            const botResponseText = getAIResponse(input.trim());
            const botMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        }, 600);

        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <FaRobot /> Asistent Virtual BooksApp
            </div>
            
            <div className={styles.messageArea} ref={messageAreaRef}>
                {messages.map(msg => (
                    <div 
                        key={msg.id} 
                        className={`${styles.message} ${msg.sender === 'bot' ? styles.botMessage : styles.userMessage}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className={styles.inputArea}>
                <input
                    type="text"
                    className={styles.chatInput}
                    placeholder="Scrie aici (ex: Vreau tuns mâine)..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className={styles.sendButton} onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
            
            <p style={{textAlign: 'center', fontSize: '11px', padding: '8px', background: '#f9f9f9', borderTop: '1px solid #eee', margin: 0}}>
                <a href="https://wa.me/407xxxxxxxx" target="_blank" style={{color: '#25d366', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}} rel="noopener noreferrer">
                    <FaWhatsapp size={14}/> Preferi WhatsApp? Click aici
                </a>
            </p>
        </div>
    );
}