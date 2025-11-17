export default function Button({ children, onClick, variant = 'solid', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'solid' | 'outline'; type?: 'button' | 'submit' | 'reset' }) {
  const cls = `btn ${variant === 'outline' ? 'btn-outline' : ''}`
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
