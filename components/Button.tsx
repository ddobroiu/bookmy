
export default function Button({ children, onClick, variant = 'solid', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'solid' | 'outline'; type?: 'button' | 'submit' | 'reset' }) {
  const base = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 text-base';
  const solid = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-xl hover:from-pink-500 hover:to-indigo-500';
  const outline = 'border-2 border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 hover:scale-105 hover:shadow-md';
  const cls = `${base} ${variant === 'outline' ? outline : solid}`;
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
      <style jsx>{`
        button:hover {
          transition: transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s;
        }
      `}</style>
    </button>
  );
}
