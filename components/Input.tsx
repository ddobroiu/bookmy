
export default function Input({ label, value, onChange, type = 'text', placeholder = '', className = '', icon }: { label?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string; icon?: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      {label && <div className="text-sm mb-1 font-semibold text-gray-700 font-sans">{label}</div>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`w-full border-2 border-gray-200 rounded-xl px-3 py-2 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 focus:ring-opacity-80 transition-all duration-200 bg-white ${icon ? 'pl-10' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
        />
      </div>
    </label>
  )
}
