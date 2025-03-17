import React from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }: CardProps) {
  return (
    <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children }: CardProps) {
  return (
    <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = '', children }: CardProps) {
  return (
    <p className={`mt-1 max-w-2xl text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  )
}

export function CardContent({ className = '', children }: CardProps) {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ className = '', children }: CardProps) {
  return (
    <div className={`px-4 py-4 sm:px-6 bg-gray-50 ${className}`}>
      {children}
    </div>
  )
} 