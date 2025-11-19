// /src/lib/subscription.js

export const PLANS = {
    BASIC: {
        id: 'BASIC',
        name: 'Basic (Start)',
        price: 59,
        maxCalendars: 1, // 1 Angajat/Resursă
        includedCredits: 50,
        features: ['1 Calendar', 'Servicii Nelimitate', 'Email Gratuit', '50 Credite/lună']
    },
    STANDARD: {
        id: 'STANDARD',
        name: 'Standard (Growth)',
        price: 159,
        maxCalendars: 5, // Până la 5
        includedCredits: 200,
        features: ['Până la 5 Calendare', 'Servicii Nelimitate', 'Email Gratuit', '200 Credite/lună']
    },
    PREMIUM: {
        id: 'PREMIUM',
        name: 'Premium (Business)',
        price: 299,
        maxCalendars: 999, // Nelimitat
        includedCredits: 500,
        features: ['Calendare Nelimitate', 'Prioritate Suport', 'Email Gratuit', '500 Credite/lună']
    }
};

export const CREDIT_PACKAGES = [
    { id: 'URGENT', credits: 100, price: 50, label: 'Mic' },
    { id: 'STANDARD', credits: 500, price: 200, label: 'Best Value', recommended: true },
    { id: 'HORECA', credits: 2000, price: 600, label: 'Volum Mare' }
];

export const checkSubscriptionLimit = (plan, currentCount) => {
    const limit = PLANS[plan]?.maxCalendars || 1;
    return currentCount < limit;
};