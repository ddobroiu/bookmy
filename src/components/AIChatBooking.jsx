// /components/AIChatBooking.jsx (COD COMPLET)

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import styles from './AIChat.module.css';

// Simulare Logică AI (răspunde bazat pe cuvinte cheie)
const getAIResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('buna') || msg.includes('salut')) {
        return "Salut! Sunt asistentul AI BooksApp. Cum te pot ajuta? Pot face programări pentru tine. Ce serviciu dorești?";
    }
    if (msg.includes('tund') || msg.includes('tuns') || msg.includes('frizerie')) {
        return "Înțeles, dorești 'Tuns Bărbați'. Pentru ce dată și oră cauți o programare? (Ex: Mâine la 15:00)";
    }
    if (msg.includes('maine') || msg.includes('vineri') || msg.includes('ora')) {
        return "Am notat: Mâine, la 15:00. Verific disponibilitatea în calendar... Găsit! Doresc să finalizezi programarea pentru 'Tuns Bărbați' la 'Maria' mâine la ora 15:00?";
    }
    if (msg.includes('da') || msg.includes('confirma')) {
        // Simulare apel API real aici:
        return "Perfect! Programarea ta a fost SALVATĂ în calendarul salonului. Mulțumesc!";
    }
    return "Îmi cer scuze, nu am înțeles. Poți reformula, te rog? (Ex: Vreau masaj mâine.)";
};

export default function AIChatBooking() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Salut! Sunt asistentul AI. Pot face o programare rapidă pentru tine. Ce serviciu dorești?", sender: 'bot' }
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
        
        // 1. Adaugă mesajul utilizatorului
        setMessages((prev) => [...prev, userMessage]);

        // 2. Generează răspunsul AI (simulat)
        const botResponseText = getAIResponse(input.trim());

        // 3. Adaugă răspunsul bot-ului
        setTimeout(() => {
            const botMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        }, 500);

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
                <FaRobot /> Chat Asistent Programări
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
                    placeholder="Scrie mesajul tău..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className={styles.sendButton} onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
            
            <p style={{textAlign: 'center', fontSize: '12px', padding: '5px'}}>
                Sau <a href="https://wa.me/407xxxxxxxx" target="_blank" style={{color: '#25d366', fontWeight: 'bold'}} rel="noopener noreferrer">Continuă pe WhatsApp</a> <FaWhatsapp style={{marginLeft: '5px'}}/>
            </p>
        </div>
    );
}