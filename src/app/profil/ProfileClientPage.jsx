'use client';

import React, { useState } from 'react';

export default function ProfileClientPage({ initialUserData }) {
  const [userData, setUserData] = useState(initialUserData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profilul Meu</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nume:</label>
          <p className="text-gray-900">{userData.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900">{userData.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Număr de telefon:</label>
          <p className="text-gray-900">{userData.phoneNumber || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
          <p className="text-gray-900">{userData.role}</p>
        </div>
        {/* Add an edit button later */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => alert('Funcționalitatea de editare va fi adăugată în curând!')}
        >
          Editează Profilul
        </button>
      </div>
    </div>
  );
}
