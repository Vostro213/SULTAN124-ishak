export default function ModeToggle({ mode, onChange, options }) {
  return (
    <div className="mode-toggle" role="tablist">
      {options.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={mode === id}
          className={`mode-toggle-btn${mode === id ? ' active' : ''}`}
          onClick={() => onChange(id)}
        >
          {icon && <span>{icon}</span>}
          {label}
        </button>
      ))}
    </div>
  )
}
