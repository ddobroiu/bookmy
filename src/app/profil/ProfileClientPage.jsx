'use client';

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Link from 'next/link';

export default function ProfileClientPage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', email: '', phoneNumber: '', role: '' });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  React.useEffect(() => {
    if (loading) {
      return <div className="container mx-auto p-4">Se încarcă profilul...</div>;
    }
    if (!userData) {
      return <div className="container mx-auto p-4 text-red-500">Nu s-au găsit date de profil. Relogați-vă!</div>;
    }

    // Sidebar client
    const sidebar = (
      <aside style={{ minWidth: 220, background: '#f8fafc', borderRadius: 8, padding: 24, marginRight: 32, boxShadow: '0 2px 8px #eee' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <a href="/profil" style={{ fontWeight: 700, color: '#007bff' }}>Profilul Meu</a>
          <a href="/profil/programari" style={{ fontWeight: 500 }}>Programările Mele</a>
          <a href="/profil/recenzii" style={{ fontWeight: 500 }}>Recenziile Mele</a>
        </nav>
      </aside>
    );

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {sidebar}
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Profilul Meu</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nume:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              ) : (
                <p className="text-gray-900">{userData.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <p className="text-gray-900">{userData.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Număr de telefon:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editedData.phoneNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              ) : (
                <p className="text-gray-900">{userData.phoneNumber || 'N/A'}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
              <p className="text-gray-900">{userData.role}</p>
            </div>
            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSaveClick}
                >
                  Salvează
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleCancelClick}
                >
                  Anulează
                </button>
              </div>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleEditClick}
              >
                Editează Profilul
              </button>
            )}
          </div>
        </div>
      </div>
    );
  if (!userData) {
    return <div className="container mx-auto p-4 text-red-500">Nu s-au găsit date de profil. Relogați-vă!</div>;
  }
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:p-10 border border-gray-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-extrabold mb-4 shadow-lg ring-4 ring-blue-200">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 text-center">{userData.name || 'Utilizator'}</h1>
            <p className="text-gray-600 text-md sm:text-lg text-center">{userData.email}</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">Detalii Profil</h2>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">Nume:</label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              name="name"
              value={editedData.name}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          ) : (
            <p className="text-gray-900 text-base bg-gray-50 p-3 rounded-lg">{userData.name}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
          <p className="text-gray-900 text-base bg-gray-50 p-3 rounded-lg">{userData.email}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneNumber">Număr de telefon:</label>
          {isEditing ? (
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={editedData.phoneNumber}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          ) : (
            <p className="text-gray-900 text-base bg-gray-50 p-3 rounded-lg">{userData.phoneNumber || 'N/A'}</p>
          )}
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Rol:</label>
          <p className="text-gray-900 text-base bg-gray-50 p-3 rounded-lg">{userData.role}</p>
        </div>
        {isEditing ? (
          <div className="flex space-x-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
              onClick={handleSaveClick}
            >
              Salvează Modificările
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-200"
              onClick={handleCancelClick}
            >
              Anulează
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
              onClick={handleEditClick}
            >
              Editează Profilul
            </button>
            <Link href="/profil/programari" className="text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200">
              Programările Mele
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
</section>
