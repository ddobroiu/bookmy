// /src/lib/ai-service.js (NOU - CREIERUL CENTRAL)

/**
 * Această funcție va fi folosită atât de Site cât și de WhatsApp Webhook.
 * @param {string} message - Mesajul primit de la utilizator
 * @param {object} context - Date despre utilizator (dacă e logat, istoric etc.)
 */
export async function processUserMessage(message, context = {}) {
    const msg = message.toLowerCase();
    let responseText = "";
    let intent = "GENERAL"; // GENERAL, BOOKING, INFO, DISPONIBILITATE

    // 1. Salut & Introducere
    if (msg.includes('buna') || msg.includes('salut') || msg.includes('hello')) {
        const name = context.userName ? ` ${context.userName}` : '';
        responseText = `Salut${name}! 👋 Sunt asistentul virtual BooksApp. Te pot ajuta cu o programare, informații despre servicii sau recomandări. Ce dorești?`;
    }
    
    // 2. Căutare Servicii (Intent Detection)
    else if (msg.includes('tund') || msg.includes('tuns') || msg.includes('frizerie')) {
        intent = "INFO";
        responseText = "Am înțeles, cauți servicii de frizerie. 💇‍♂️ Avem 'Barber Shop Urban' și 'Salon Lux' disponibile. Vrei să verific disponibilitatea pentru azi sau mâine?";
    }
    else if (msg.includes('mancare') || msg.includes('restaurant') || msg.includes('pizza')) {
        intent = "INFO";
        responseText = "Sună delicios! 🍕 Îți pot recomanda 'Sky View' sau pizzerii locale. Pentru câte persoane dorești masă?";
    }

    // 3. Flux Rezervare
    else if (msg.includes('programare') || msg.includes('rezerva') || msg.includes('vreau')) {
        intent = "BOOKING";
        responseText = "Sigur! Pentru ce serviciu și în ce zi te-ar interesa? (Ex: Tuns, mâine la 14)";
    }
    else if (msg.includes('maine') || msg.includes('azi') || msg.includes('luni')) {
        intent = "DISPONIBILITATE";
        // Aici vom conecta ulterior baza de date pentru a verifica sloturile reale!
        responseText = "Am verificat calendarul. 📅 Avem locuri libere la **14:00**, **16:30** și **18:00**. Care ți se potrivește?";
    }
    
    // 4. Fallback (Nu a înțeles)
    else {
        responseText = "Încă învăț și nu sunt sigur că am înțeles. 🤔 Poți să reformulezi? (Ex: 'Vreau o programare la masaj')";
    }

    return {
        text: responseText,
        intent: intent,
        // Putem returna și acțiuni sugerate pentru interfață (Butoane)
        actions: intent === 'DISPONIBILITATE' ? ['14:00', '16:30', '18:00'] : null
    };
}