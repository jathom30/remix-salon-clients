import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"

export type ButtonKind = 'default' | 'primary' | 'danger' | 'text' | 'secondary'

export type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon?: IconDefinition;
  isDisabled?: boolean
  isRounded?: boolean
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  kind?: ButtonKind
  name?: string
  value?: string
  children?: React.ReactNode
}

export function Button({ onClick, icon, name, value, isDisabled = false, isRounded = false, type = 'button', kind = 'default', children }: ButtonProps) {

  const defaultStyles = "flex items-center gap-2 rounded justify-center font-bold py-2 px-4 h-8 border-0 bg-component-background-alt text-text-subdued hover:bg-component-background-darken"

  const additionalStyles = () => {
    if (isDisabled) {
      return 'text-white bg-component-background-alt pointer-events-none'
    }
    switch (kind) {
      case 'primary':
        return "bg-primary text-white hover:bg-primary-darken"
      case 'secondary':
        return "bg-transparent text-secondary hover:bg-secondary hover:text-white"
      case 'danger':
        return 'text-danger bg-transparent hover:text-white hover:bg-danger'
      case 'text':
        return 'text-text-subdued background-transparent hover: bg-background-alt'
      default:
        return ''
    }
  }

  return (
    <button
      name={name}
      className={`${defaultStyles} ${additionalStyles()} ${isRounded ? 'rounded-full' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      value={value}
    >
      {icon ? <FontAwesomeIcon icon={icon} /> : null}
      {children}
    </button>
  )
}