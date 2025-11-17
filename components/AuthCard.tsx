import React from 'react'

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white backdrop-blur-sm/5 border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">BM</div>
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              </div>
            </div>

            <div className="mt-2">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
