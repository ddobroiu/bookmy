// /src/app/dashboard/forms/submissions/page.js (NOU)

'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaFileSignature, FaTimes, FaCalendarAlt, FaUser } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/ro';

moment.locale('ro');

// --- MODAL PENTRU VIZUALIZARE RĂSPUNSURI ---
const SubmissionModal = ({ submission, onClose }) => {
    if (!submission) return null;

    // Parsăm răspunsurile din JSON
    const answers = typeof submission.answers === 'string' 
        ? JSON.parse(submission.answers) 
        : submission.answers;

    return (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
            <div style={{background:'white', width:'600px', maxHeight:'90vh', borderRadius:'12px', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
                
                {/* Header Modal */}
                <div style={{padding:'20px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f8f9fa'}}>
                    <div>
                        <h3 style={{margin:0, color:'#1c2e40'}}>{submission.formTemplate.title}</h3>
                        <div style={{fontSize:'13px', color:'#666', marginTop:'5px'}}>
                            Completat de: <strong>{submission.client?.name || 'Client Anonim'}</strong>
                        </div>
                    </div>
                    <button onClick={onClose} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#666'}}><FaTimes/></button>
                </div>

                {/* Content Modal (Scrollable) */}
                <div style={{padding:'25px', overflowY:'auto'}}>
                    
                    {/* Detalii Programare */}
                    <div style={{marginBottom:'25px', padding:'15px', background:'#e6f0ff', borderRadius:'8px', border:'1px solid #b8daff'}}>
                        <div style={{fontSize:'12px', fontWeight:'bold', color:'#0056b3', marginBottom:'5px', textTransform:'uppercase'}}>Asociat cu programarea:</div>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#004085'}}>
                            <FaCalendarAlt /> 
                            {moment(submission.appointment?.start).format('DD MMMM YYYY, HH:mm')} - {submission.appointment?.title}
                        </div>
                    </div>

                    {/* Întrebări și Răspunsuri */}
                    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        {submission.formTemplate.questions.map((q, idx) => {
                            const answer = answers[q.id];
                            
                            return (
                                <div key={q.id} style={{borderBottom: idx < submission.formTemplate.questions.length - 1 ? '1px dashed #eee' : 'none', paddingBottom: '15px'}}>
                                    <p style={{fontWeight:'600', color:'#333', marginBottom:'8px', fontSize:'15px'}}>
                                        {idx + 1}. {q.text}
                                    </p>
                                    
                                    <div style={{paddingLeft:'15px', borderLeft:'3px solid #eee'}}>
                                        {q.type === 'SIGNATURE' ? (
                                            <div style={{fontFamily:'cursive', fontSize:'24px', color:'#007bff', fontStyle:'italic', padding:'10px', background:'#f9f9f9', borderRadius:'6px'}}>
                                                Semnat: {answer || '(Lipsă semnătură)'}
                                            </div>
                                        ) : q.type === 'CHECKBOX' ? (
                                            <div style={{color:'#555'}}>
                                                {Array.isArray(answer) ? answer.join(', ') : answer || '-'}
                                            </div>
                                        ) : (
                                            <div style={{color:'#555', whiteSpace: 'pre-wrap'}}>
                                                {answer || '-'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Modal */}
                <div style={{padding:'15px', borderTop:'1px solid #eee', textAlign:'right'}}>
                    <button onClick={onClose} style={{padding:'10px 20px', background:'#333', color:'white', border:'none', borderRadius:'6px', cursor:'pointer'}}>Închide</button>
                </div>
            </div>
        </div>
    );
};


export default function FormSubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/partner/forms/submissions');
                if (res.ok) setSubmissions(await res.json());
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        fetchData();
    }, []);

    // Filtrare Client
    const filtered = submissions.filter(s => 
        s.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.formTemplate?.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Se încarcă arhiva...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', color: '#1c2e40', marginBottom: '30px' }}>Arhivă Răspunsuri</h1>

            {/* Bara de Căutare */}
            <div style={{background:'white', padding:'15px', borderRadius:'12px', marginBottom:'20px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:'10px'}}>
                <FaSearch style={{color:'#999', marginLeft:'10px'}} />
                <input 
                    type="text" 
                    placeholder="Caută după nume client sau titlu formular..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{border:'none', outline:'none', width:'100%', fontSize:'15px', padding:'10px'}}
                />
            </div>

            {/* Tabel Răspunsuri */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                {filtered.length === 0 ? (
                    <div style={{padding:'40px', textAlign:'center', color:'#888'}}>Nu s-au găsit formulare completate.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8f9fa', color: '#7f8c8d', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '15px' }}>Client</th>
                                <th style={{ padding: '15px' }}>Formular</th>
                                <th style={{ padding: '15px' }}>Data Completării</th>
                                <th style={{ padding: '15px' }}>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(sub => (
                                <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{fontWeight:'600', color:'#2c3e50', display:'flex', alignItems:'center', gap:'8px'}}>
                                            <FaUser style={{color:'#007bff'}}/> {sub.client?.name || 'Anonim'}
                                        </div>
                                        <div style={{fontSize:'12px', color:'#999', marginLeft:'24px'}}>{sub.client?.phoneNumber}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                            <FaFileSignature style={{color:'#666'}}/>
                                            {sub.formTemplate.title}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', color:'#555' }}>
                                        {moment(sub.createdAt).format('DD MMM YYYY, HH:mm')}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button 
                                            onClick={() => setSelectedSubmission(sub)}
                                            style={{ padding: '8px 15px', background: '#e6f0ff', color: '#007bff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <FaEye /> Vezi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {selectedSubmission && (
                <SubmissionModal 
                    submission={selectedSubmission} 
                    onClose={() => setSelectedSubmission(null)} 
                />
            )}
        </div>
    );
}