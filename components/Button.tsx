
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Button({
  children,
  onClick,
  variant = 'solid',
  type = 'button',
  className = '',
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    onClick?.()
  }

  const base = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400/50 text-base overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed'
  const solid = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-pink-500/25'
  const outline = 'border-2 border-indigo-500 text-indigo-600 bg-white/90 backdrop-blur-sm hover:bg-indigo-50 hover:border-pink-500 hover:text-pink-600'
  const cls = `${base} ${variant === 'outline' ? outline : solid} ${className}`

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      className={cls}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y, opacity: 0.6 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Button content */}
      <motion.span
        className="relative z-10"
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.button>
  )
}
