
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = '',
  icon,
  error
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setHasValue(!!newValue)
    onChange(newValue)
  }

  const isLabelFloating = isFocused || hasValue

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {icon && (
          <motion.span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none z-10"
            animate={{ scale: isFocused ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}

        <motion.input
          className={`w-full border-2 rounded-2xl px-4 py-4 font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400/30 bg-white/90 backdrop-blur-sm transition-all duration-300 text-gray-900 placeholder-transparent ${
            icon ? 'pl-12' : ''
          } ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-pink-400'}`}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type}
          placeholder={placeholder}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />

        {/* Floating label */}
        {label && (
          <motion.label
            className={`absolute left-4 pointer-events-none transition-all duration-300 font-semibold ${
              icon ? 'left-12' : ''
            } ${error ? 'text-red-500' : 'text-gray-600'}`}
            animate={{
              top: isLabelFloating ? '0.5rem' : '50%',
              fontSize: isLabelFloating ? '0.75rem' : '1rem',
              y: isLabelFloating ? 0 : '-50%',
              color: isFocused ? '#ec4899' : error ? '#ef4444' : '#4b5563'
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {label}
          </motion.label>
        )}

        {/* Focus ring animation */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-pink-400 pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-red-500 text-sm mt-2 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}
