// /src/app/dashboard/messages/page.js (NOU - UNIFIED INBOX)

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUserCircle, FaSearch, FaWhatsapp, FaGlobe, FaCircle } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/ro';

moment.locale('ro');

export default function MessagesPage() {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // Obiectul conversației selectate
    const [messages, setMessages] = useState([]); 
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    
    const messagesEndRef = useRef(null);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/partner/messages');
            if (res.ok) setConversations(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Polling pentru mesaje noi (la fiecare 5 secunde)
    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Deschide o conversație
    const selectConversation = async (conv) => {
        setActiveChat(conv);
        try {
            // Construim URL-ul în funcție de tipul userului (Web sau WhatsApp)
            const query = conv.userId ? `userId=${conv.userId}` : `phone=${conv.guestPhone}`;
            const res = await fetch(`/api/partner/messages?${query}`);
            if (res.ok) {
                setMessages(await res.json());
                scrollToBottom();
            }
        } catch (e) { console.error(e); }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeChat) return;

        const tempMsg = {
            id: Date.now(),
            content: inputText,
            sender: 'PARTNER',
            createdAt: new Date()
        };
        setMessages([...messages, tempMsg]);
        setInputText('');
        scrollToBottom();

        try {
            await fetch('/api/partner/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: activeChat.userId, 
                    guestPhone: activeChat.guestPhone,
                    content: tempMsg.content 
                })
            });
            fetchConversations(); // Actualizează lista din stânga
        } catch (e) { alert('Eroare trimitere'); }
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Se încarcă mesajele...</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {/* STÂNGA: Lista Conversații */}
            <div style={{ width: '320px', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#1c2e40', marginBottom: '15px' }}>Inbox Unificat</h2>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input type="text" placeholder="Caută..." style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
                    </div>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 && <p style={{textAlign:'center', padding:'20px', color:'#999', fontSize:'13px'}}>Nu ai mesaje.</p>}
                    {conversations.map(conv => (
                        <div 
                            key={conv.id}
                            onClick={() => selectConversation(conv)}
                            style={{
                                padding: '15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                                background: activeChat?.id === conv.id ? '#e6f0ff' : 'white',
                                display: 'flex', gap: '10px', alignItems: 'center', position: 'relative'
                            }}
                        >
                            {/* Indicator Tip (Web vs WhatsApp) */}
                            <div style={{position:'absolute', top:'10px', right:'10px', fontSize:'12px'}}>
                                {conv.type === 'WHATSAPP' ? <FaWhatsapp style={{color:'#25d366'}}/> : <FaGlobe style={{color:'#007bff'}}/>}
                            </div>

                            {conv.avatar ? (
                                <img src={conv.avatar} style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}} />
                            ) : (
                                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>
                                    <FaUserCircle size={24}/>
                                </div>
                            )}
                            
                            <div style={{flex: 1, minWidth: 0}}>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <strong style={{color:'#333', fontSize:'14px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'70%'}}>{conv.name}</strong>
                                </div>
                                <div style={{fontSize:'12px', color:'#666', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop:'3px'}}>
                                    {conv.lastMessage}
                                </div>
                                <div style={{fontSize:'10px', color:'#999', marginTop:'3px'}}>
                                    {moment(conv.lastMessageDate).fromNow()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DREAPTA: Chat Activ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {activeChat ? (
                    <>
                        {/* Header Chat */}
                        <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', background: 'white' }}>
                            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>
                                <FaUserCircle size={24}/>
                            </div>
                            <div>
                                <div style={{fontWeight:'bold', fontSize:'16px'}}>{activeChat.name}</div>
                                <div style={{fontSize:'12px', color:'#888', display:'flex', alignItems:'center', gap:'5px'}}>
                                    {activeChat.type === 'WHATSAPP' ? <FaWhatsapp color="#25d366"/> : <FaGlobe color="#007bff"/>}
                                    {activeChat.info || 'Client'}
                                </div>
                            </div>
                        </div>

                        {/* Mesaje */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f2f5f8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {messages.map(msg => {
                                const isMe = msg.sender === 'PARTNER';
                                const isAI = msg.sender === 'AI';
                                return (
                                    <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                        {isAI && <div style={{fontSize:'10px', color:'#999', marginBottom:'2px', marginLeft:'5px'}}>Bot Automat</div>}
                                        <div style={{
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            background: isMe ? '#007bff' : (isAI ? '#e2e8f0' : 'white'),
                                            color: isMe ? 'white' : (isAI ? '#555' : '#333'),
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            borderTopRightRadius: isMe ? '2px' : '12px',
                                            borderTopLeftRadius: isMe ? '12px' : '2px',
                                            border: isAI ? '1px solid #cbd5e0' : 'none'
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#999', marginTop: '3px', textAlign: isMe ? 'right' : 'left' }}>
                                            {moment(msg.createdAt).format('HH:mm')}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', background: 'white' }}>
                            <input 
                                type="text" 
                                placeholder="Scrie un mesaj..." 
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                style={{ flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize:'14px' }}
                            />
                            <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow:'0 2px 5px rgba(0,123,255,0.3)' }}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#ccc' }}>
                        <div style={{background:'#f8f9fa', padding:'40px', borderRadius:'50%', marginBottom:'20px'}}>
                            <FaPaperPlane style={{ fontSize: '40px', color: '#dee2e6' }} />
                        </div>
                        <p style={{fontSize:'16px', color:'#888'}}>Selectează o conversație pentru a începe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}