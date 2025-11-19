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
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditedData(data);
        } else {
          setUserData(null);
        }
      } catch {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData(userData); // Initialize editedData with current userData
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData(userData); // Revert changes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    if (!editedData.name || !editedData.phoneNumber) {
      addToast('Numele și numărul de telefon sunt obligatorii!', 'error');
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedData.name,
          phoneNumber: editedData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la actualizarea profilului');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setIsEditing(false);
      addToast('Profil actualizat cu succes!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast(error.message || 'Eroare la actualizarea profilului.', 'error');
    }
  };
  // ...existing code...

  if (loading) {
    return <div className="container mx-auto p-4">Se încarcă profilul...</div>;
  }
  if (!userData) {
    return <div className="container mx-auto p-4 text-red-500">Nu s-au găsit date de profil. Relogați-vă!</div>;
  }
  return (
    <section className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-semibold mb-4">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{userData.name || 'Utilizator'}</h1>
            <p className="text-gray-600">{userData.email}</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalii Profil</h2>
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
  );
}
