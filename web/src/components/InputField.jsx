import { useState } from 'react'

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  icon,
  autoComplete,
  min,
  max,
  step,
  options,
  as = 'input',
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    autoComplete,
    className: `field-input${error ? ' error' : ''}`,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${name}-error` : hint ? `${name}-hint` : undefined,
  }

  return (
    <div className="field">
      {label && (
        <label htmlFor={name} className="field-label">
          {required && <span className="required">*</span>}
          {label}
        </label>
      )}

      <div className={`field-input-wrap${icon ? ' has-icon' : ''}`}>
        {icon && <span className="field-icon">{icon}</span>}

        {as === 'select' ? (
          <select {...commonProps} className={`field-select${error ? ' error' : ''}`}>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...commonProps}
            type={inputType}
            min={min}
            max={max}
            step={step}
          />
        )}

        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? 'إخفاء' : 'إظهار'}
          </button>
        )}
      </div>

      {hint && !error && (
        <span id={`${name}-hint`} className="field-hint">
          {hint}
        </span>
      )}

      {error && (
        <span id={`${name}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
