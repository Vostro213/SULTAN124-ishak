import { useMemo, useState } from 'react'
import ModeToggle from '../components/ModeToggle'
import InputField from '../components/InputField'
import { speedMinutes, speedTypes } from '../data/gameData'
import { formatDuration, formatMinutesLabel, toTotalMinutes } from '../utils/format'

const MODES = [
  { id: 'detailed', label: 'تفصيلي (صناديق)', icon: '📋' },
  { id: 'manual', label: 'إجمالي جاهز', icon: '✏️' },
]

const emptyManual = () => ({ days: '', hours: '', minutes: '' })

export default function SpeedCalculator() {
  const [mode, setMode] = useState('detailed')
  const [values, setValues] = useState({})
  const [manual, setManual] = useState(() =>
    Object.fromEntries(speedTypes.map((t) => [t.id, emptyManual()])),
  )
  const [results, setResults] = useState({})

  const setVal = (type, min, val) => {
    setValues((v) => ({ ...v, [`${type}${min}`]: val }))
  }

  const setManualField = (type, field, val) => {
    setManual((m) => ({ ...m, [type]: { ...m[type], [field]: val } }))
  }

  const calcDetailed = (type) => {
    let total = 0
    speedMinutes.forEach((min) => {
      total += (parseInt(values[`${type}${min}`], 10) || 0) * min
    })
    return total
  }

  const calcManual = (type) => toTotalMinutes(manual[type])

  const calculateOne = (type) => {
    const total = mode === 'detailed' ? calcDetailed(type) : calcManual(type)
    setResults((r) => ({ ...r, [type]: formatDuration(total) }))
  }

  const calculateAll = () => {
    const next = {}
    speedTypes.forEach(({ id }) => {
      const total = mode === 'detailed' ? calcDetailed(id) : calcManual(id)
      next[id] = formatDuration(total)
    })
    setResults(next)
  }

  const grandTotal = useMemo(() => {
    return speedTypes.reduce((sum, { id }) => {
      return sum + (mode === 'detailed' ? calcDetailed(id) : calcManual(id))
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, values, manual])

  return (
    <>
      <div className="page-header">
        <h1>⚡ حاسبة التسريعات</h1>
        <p>تفصيلي لكل صندوق — أو أدخل الإجمالي جاهزاً إن كان عندك</p>
      </div>

      <div className="card calc-toolbar">
        <ModeToggle mode={mode} onChange={setMode} options={MODES} />
        <p className="mode-hint">
          {mode === 'detailed'
            ? 'عدّ كل نوع تسريع (1د، 5د، 15د...) — للي يفتح الحقيبة صندوق صندوق'
            : 'أدخل المدة الإجمالية مباشرة — للي عنده الرقم الجاهز من اللعبة'}
        </p>
        <button type="button" className="btn btn-primary btn-sm" onClick={calculateAll}>
          احسب كل الأنواع
        </button>
      </div>

      {grandTotal > 0 && (
        <div className="summary-banner">
          <span>⏱️ إجمالي كل التسريعات</span>
          <strong>{formatDuration(grandTotal)}</strong>
        </div>
      )}

      {speedTypes.map(({ id, label }) => (
        <div key={id} className="card calc-section">
          <h2>{label}</h2>

          {mode === 'detailed' ? (
            <div className="speed-grid">
              {speedMinutes.map((min) => (
                <div key={min} className="speed-cell">
                  <label htmlFor={`${id}${min}`}>{formatMinutesLabel(min)}</label>
                  <input
                    id={`${id}${min}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={values[`${id}${min}`] || ''}
                    onChange={(e) => setVal(id, min, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="manual-duration-row">
              <InputField
                label="أيام"
                name={`${id}-days`}
                type="number"
                min="0"
                value={manual[id].days}
                onChange={(e) => setManualField(id, 'days', e.target.value)}
                placeholder="0"
              />
              <InputField
                label="ساعات"
                name={`${id}-hours`}
                type="number"
                min="0"
                value={manual[id].hours}
                onChange={(e) => setManualField(id, 'hours', e.target.value)}
                placeholder="0"
              />
              <InputField
                label="دقائق"
                name={`${id}-minutes`}
                type="number"
                min="0"
                value={manual[id].minutes}
                onChange={(e) => setManualField(id, 'minutes', e.target.value)}
                placeholder="0"
              />
            </div>
          )}

          <button type="button" className="btn btn-outline btn-sm" onClick={() => calculateOne(id)}>
            احسب {label}
          </button>
          {results[id] && (
            <div className="result-box">
              {label}: {results[id]}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
