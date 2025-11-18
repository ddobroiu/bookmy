// /app/dashboard/onboarding/page.js (COD COMPLET ACTUALIZAT CU CATEGORII)

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaStore, FaListUl, FaClock, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './onboarding.module.css'; 

const steps = ['Detalii Afacere', 'Servicii & Prețuri', 'Program de Lucru', 'Finalizare'];

// Lista fixă a categoriilor de afaceri
const BUSINESS_CATEGORIES = [
    { value: '', label: '— Alege Categoria —' },
    { value: 'salon', label: 'Salon de Înfrumusețare' },
    { value: 'barber', label: 'Frizerie / Barber Shop' },
    { value: 'nails', label: 'Manichiură / Unghii' },
    { value: 'massage', label: 'Masaj / Wellness' },
    { value: 'waxing', label: 'Epilare / Cosmetica' },
    { value: 'tattoo', label: 'Studio Tatuaje / Piercing' },
];


export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    slug: '', 
    address: '',
    category: '', // NOU: Categoria Afacerii
    services: [{ name: '', price: '', duration: '60' }], 
    schedule: {}
  });
  const router = useRouter();

  const handleNext = () => {
    // Validare suplimentară NOUĂ: Categoria și Numele trebuie să fie completate
    if (currentStep === 0 && (!formData.name || !formData.category)) {
      alert('Vă rugăm introduceți numele salonului și selectați o categorie.');
      return;
    }
    
    // Validare Servicii (Logica anterioară)
    if (currentStep === 1) {
        const hasValidService = formData.services.some(
            s => s.name && s.price && s.duration
        );
        if (!hasValidService) {
             alert('Vă rugăm adăugați cel puțin un serviciu completat corect.');
             return;
        }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmission();
    }
  };
  
  const handleSubmission = async () => {
    alert('Simulare trimitere date afacere către baza de date!');
    console.log('Final Data:', formData);

    // ... (Logica de salvare în DB și redirecționare) ...
    localStorage.setItem('salonSetup', 'true'); 
    router.push('/dashboard'); 
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LOGICA PENTRU SERVICII (Fără modificări) ---
  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = formData.services.map((service, i) => {
        if (i === index) {
            return { ...service, [name]: value };
        }
        return service;
    });
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData(prev => ({ 
        ...prev, 
        services: [...prev.services, { name: '', price: '', duration: '60' }]
    }));
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, services: newServices }));
  };
  // ------------------------------------

  
  // RENDERIZAREA FORMULARULUI PE PAS
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}><FaStore /> Detalii Afacere</h2>
            
            {/* NOU: Selector Categorie */}
            <div className={styles.formGroup}>
              <label>Categoria Afacerii</label>
              <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                  className={styles.inputField} 
                  required
              >
                  {BUSINESS_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value} disabled={cat.value === ''}>
                          {cat.label}
                      </option>
                  ))}
              </select>
            </div>
            {/* Sfârșit NOU */}

            <div className={styles.formGroup}>
              <label>Nume Afacere</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={styles.inputField} required />
            </div>
            <div className={styles.formGroup}>
              <label>Adresa Publică</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={styles.inputField} required />
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}><FaListUl /> Servicii & Prețuri</h2>
            <p className={styles.subtitle}>Adăugați serviciile pe care clienții le pot programa.</p>

            {formData.services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Nume Serviciu (ex: Tuns Bărbați)"
                        value={service.name} 
                        onChange={(e) => handleServiceChange(index, e)} 
                        className={styles.serviceInput} 
                        required
                    />
                    <input 
                        type="number" 
                        name="price" 
                        placeholder="Preț (RON)"
                        value={service.price} 
                        onChange={(e) => handleServiceChange(index, e)} 
                        className={styles.servicePriceInput} 
                        required
                    />
                    <select 
                        name="duration"
                        value={service.duration}
                        onChange={(e) => handleServiceChange(index, e)}
                        className={styles.serviceDurationSelect}
                    >
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                    </select>
                    <button type="button" onClick={() => removeService(index)} className={styles.removeButton}>
                        <FaTrash />
                    </button>
                </div>
            ))}
            
            <button type="button" onClick={addService} className={styles.addButton}>
                <FaPlus style={{marginRight: '8px'}} /> Adaugă Serviciu
            </button>
            
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}><FaClock /> Program de Lucru</h2>
            <p>Aici va veni un formular pentru setarea orarului săptămânal (L-D).</p>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}><FaCheckCircle style={{color: 'green'}} /> Finalizare</h2>
            <p>Sunteți gata! Confirmați detaliile și publicați afacerea.</p>
            <p className={styles.summaryText}>Nume: <strong>{formData.name}</strong></p>
            <p className={styles.summaryText}>Categorie: <strong>{BUSINESS_CATEGORIES.find(c => c.value === formData.category)?.label}</strong></p>
            <p className={styles.summaryText}>Adresă: <strong>{formData.address}</strong></p>
            <p className={styles.summaryText}>Servicii adăugate: <strong>{formData.services.filter(s => s.name).length}</strong></p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <h1 className={styles.mainTitle}>Configurarea Afacerii Tale</h1>
      
      {/* Indicator de Pași (fără modificări) */}
      <div className={styles.stepIndicator}>
        {steps.map((step, index) => (
          <div key={index} className={`${styles.step} ${index === currentStep ? styles.active : index < currentStep ? styles.completed : ''}`}>
            {index < currentStep ? <FaCheckCircle /> : index + 1}
            <span className={styles.stepLabel}>{step}</span>
          </div>
        ))}
      </div>

      {/* Conținutul Pasului (fără modificări) */}
      <div className={styles.formCard}>
        {renderStepContent()}
      </div>

      {/* Navigare (fără modificări) */}
      <div className={styles.navigation}>
        <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0} className={styles.backButton}>
          Înapoi
        </button>
        <button onClick={handleNext} className={styles.nextButton}>
          {currentStep === steps.length - 1 ? 'Finalizează & Publică' : 'Continuă'}
        </button>
      </div>
    </div>
  );
}