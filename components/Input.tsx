export default function Input({ label, value, onChange, type = 'text', placeholder = '', className = '' }: { label?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && <div className="text-sm mb-1 font-medium">{label}</div>}
      <input
        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-80"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
      />
    </label>
  )
}
