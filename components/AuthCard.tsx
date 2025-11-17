
import React from 'react'


export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center py-12 px-4 animate-fadein">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border-2 border-transparent hover:border-indigo-400 transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden animate-card">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg animate-bounce-slow">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32" className="mr-1">
                  <circle cx="16" cy="16" r="16" fill="url(#bm-gradient)" />
                  <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" dy=".3em">BM</text>
                  <defs>
                    <linearGradient id="bm-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ec4899" />
                      <stop offset="1" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight drop-shadow-sm">{title}</h2>
                {subtitle && <p className="text-base text-gray-500 mt-1 font-medium animate-fadein">{subtitle}</p>}
              </div>
            </div>

            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-fadein { animation: fadein 1s ease; }
        .animate-card { animation: cardin 0.7s cubic-bezier(.4,0,.2,1); }
        .animate-bounce-slow { animation: bounce 2s infinite alternate; }
        @keyframes fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes cardin { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-8px); } }
      `}</style>
    </div>
  )
}
