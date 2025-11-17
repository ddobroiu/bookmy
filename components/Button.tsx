export default function Button({ children, onClick, variant = 'solid' }: { children: React.ReactNode; onClick?: () => void; variant?: 'solid' | 'outline' }) {
  const cls = `btn ${variant === 'outline' ? 'btn-outline' : ''}`
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
