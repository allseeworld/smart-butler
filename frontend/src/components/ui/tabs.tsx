import React from 'react'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | null>(null)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, className = '', children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`} data-value={value}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className = '', children }: TabsListProps) {
  return (
    <div className={`flex space-x-1 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, disabled = false, className = '', children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  const handleClick = () => {
    if (!disabled && context?.onValueChange) {
      context.onValueChange(value)
    }
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      className={`
        px-4 py-2 text-sm font-medium 
        ${isActive 
          ? 'text-primary-600 border-b-2 border-primary-600' 
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className = '', children }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  if (!isActive) return null

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
} 