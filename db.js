// /app/db.js

// Aceasta este o simulare a interacțiunii cu baza de date Railway

// --------------------------------------
// 1. UTILIZATORI ȘI STAREA DE LOGIN
// --------------------------------------

export const usersDB = [
    { email: 'client@test.com', password: '123', role: 'client', salonSetup: false },
    { email: 'partner@test.com', password: '123', role: 'partner', salonSetup: true }, 
    { email: 'newpartner@test.com', password: '123', role: 'partner', salonSetup: false }, 
];

// --------------------------------------
// 2. DETALII AFACERI (SALOANE)
// --------------------------------------

export const salonsDB = [
    {
        id: 'salon-de-lux-central', 
        name: 'Salon de Lux Central',
        rating: 4.8,
        reviews: 120,
        address: 'Strada Exemplului, Nr. 15, București',
        schedule: 'Luni - Sâmbătă: 09:00 - 20:00',
        description: 'Suntem un salon modern care oferă servicii de înaltă calitate.',
        category: 'salon', 
    }
];

// --------------------------------------
// 3. PROGRAMĂRI (CALENDAR)
// --------------------------------------

export const appointmentsDB = [
    { 
        id: 1, 
        title: 'Programare: Client X (Manichiură)',
        start: new Date(new Date().setHours(15, 0, 0, 0)),
        end: new Date(new Date().setHours(16, 0, 0, 0)),
        isBlock: false,
        salonId: 'salon-de-lux-central',
    },
];

// --------------------------------------
// 4. SERVICII ȘI ANGAJAȚI
// --------------------------------------

export const servicesDB = [
    { id: 1, salonId: 'salon-de-lux-central', name: 'Tuns Bărbați', price: 80, duration: 45 },
    { id: 2, salonId: 'salon-de-lux-central', name: 'Vopsit', price: 150, duration: 90 },
    { id: 3, salonId: 'salon-de-lux-central', name: 'Manichiură', price: 80, duration: 60 },
];

export const staffDB = [
    { id: 101, salonId: 'salon-de-lux-central', name: 'Maria Popescu', role: 'Stilist Senior' },
    { id: 102, salonId: 'salon-de-lux-central', name: 'Ion Vasile', role: 'Barber' },
];

// --------------------------------------
// 5. FUNCȚII HELPER
// --------------------------------------

export const findUser = (email) => {
    return usersDB.find(u => u.email === email);
};

export const getSalonDetails = (slug) => {
    return salonsDB.find(s => s.id === slug);
};

export const findSalonServices = (salonId) => {
    return servicesDB.filter(s => s.salonId === salonId);
};

export const findSalonStaff = (salonId) => {
    return staffDB.filter(s => s.salonId === salonId);
};

export const addServiceToDB = (service) => {
    const newId = servicesDB.length > 0 ? servicesDB[servicesDB.length - 1].id + 1 : 1;
    const newService = { ...service, id: newId };
    servicesDB.push(newService);
    return newService;
};