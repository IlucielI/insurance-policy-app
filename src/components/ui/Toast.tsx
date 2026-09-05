'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface ToastProps {
  id: string
  variant?: ToastVariant
  title?: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  variant = 'info',
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(id), 200)
  }

  const variants = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20 border-green-500',
      icon: '✓',
      iconBg: 'bg-green-500',
      text: 'text-green-800 dark:text-green-200'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-500',
      icon: '✕',
      iconBg: 'bg-red-500',
      text: 'text-red-800 dark:text-red-200'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
      icon: '⚠',
      iconBg: 'bg-yellow-500',
      text: 'text-yellow-800 dark:text-yellow-200'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
      icon: 'ℹ',
      iconBg: 'bg-blue-500',
      text: 'text-blue-800 dark:text-blue-200'
    }
  }

  const config = variants[variant]
  const animationClass = isExiting ? 'animate-slide-up opacity-0' : 'animate-slide-down'

  return (
    <div
      className={`${config.bg} ${config.text} ${animationClass} flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4 max-w-md w-full transition-all duration-200`}
    >
      <div className={`${config.iconBg} text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
        {config.icon}
      </div>
      <div className="flex-1 pt-0.5">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}

// Toast Container
export interface ToastContainerProps {
  position?: ToastPosition
  toasts: Array<ToastProps>
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  toasts
}) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }

  if (toasts.length === 0) return null

  const container = (
    <div className={`fixed ${positions[position]} z-[1060] flex flex-col gap-3`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )

  return createPortal(container, document.body)
}

export default Toast
