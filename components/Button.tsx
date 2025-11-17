export default function Button({ children, onClick, variant = 'solid', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'solid' | 'outline'; type?: 'button' | 'submit' | 'reset' }) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium shadow-sm transition-colors'
  const solid = 'bg-indigo-600 text-white hover:bg-indigo-700'
  const outline = 'border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50'
  const cls = `${base} ${variant === 'outline' ? outline : solid}`
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
