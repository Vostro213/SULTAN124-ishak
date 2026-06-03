import { useMemo, useState } from 'react'
import ModeToggle from '../components/ModeToggle'
import InputField from '../components/InputField'
import { resourcesData } from '../data/gameData'
import { formatNumber, parseResourceInput } from '../utils/format'

const MODES = [
  { id: 'detailed', label: 'تفصيلي (صناديق)', icon: '📦' },
  { id: 'manual', label: 'إجمالي جاهز', icon: '✏️' },
]

const UNIT_OPTIONS = [
  { value: 'raw', label: 'رقم مباشر' },
  { value: 'K', label: 'K (ألف)' },
  { value: 'M', label: 'M (مليون)' },
  { value: 'B', label: 'B (مليار)' },
]

export default function ResourcesCalculator() {
  const [mode, setMode] = useState('detailed')
  const [values, setValues] = useState({})
  const [manual, setManual] = useState(() =>
    Object.fromEntries(resourcesData.map((r) => [r.id, { amount: '', unit: 'M' }])),
  )
  const [results, setResults] = useState({})

  const setVal = (id, unit, kind, val) => {
    setValues((v) => ({ ...v, [`${id}_${unit}${kind}`]: val }))
  }

  const calcDetailed = (resource) => {
    let total = 0
    resource.units.forEach((unit) => {
      const normal = parseInt(values[`${resource.id}_${unit}`], 10) || 0
      const safe = parseInt(values[`${resource.id}_${unit}_safe`], 10) || 0
      total += (normal + safe) * unit
    })
    return total
  }

  const calcManual = (resourceId) => {
    const { amount, unit } = manual[resourceId]
    return parseResourceInput(amount, unit)
  }

  const getTotal = (resource) =>
    mode === 'detailed' ? calcDetailed(resource) : calcManual(resource.id)

  const calculateOne = (resource) => {
    const total = getTotal(resource)
    setResults((r) => ({
      ...r,
      [resource.id]: `${formatNumber(total)} (${total.toLocaleString('ar')})`,
    }))
  }

  const calculateAll = () => {
    const next = {}
    resourcesData.forEach((resource) => {
      const total = getTotal(resource)
      next[resource.id] = `${formatNumber(total)} (${total.toLocaleString('ar')})`
    })
    setResults(next)
  }

  const summary = useMemo(() => {
    return resourcesData
      .map((r) => ({ name: r.name, id: r.id, total: getTotal(r) }))
      .filter((r) => r.total > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, values, manual])

  return (
    <>
      <div className="page-header">
        <h1>📦 حاسبة موارد الحقيبة</h1>
        <p>صناديق مفصّلة — أو إجمالي جاهز من شاشة اللعبة</p>
      </div>

      <div className="card calc-toolbar">
        <ModeToggle mode={mode} onChange={setMode} options={MODES} />
        <p className="mode-hint">
          {mode === 'detailed'
            ? 'عدّ صناديق كل حجم (عادي + 🔒 آمن)'
            : 'الصق الرقم كما يظهر في اللعبة — مثلاً 520.6 مع وحدة M'}
        </p>
        <button type="button" className="btn btn-primary btn-sm" onClick={calculateAll}>
          احسب كل الموارد
        </button>
      </div>

      {summary.length > 0 && (
        <div className="card summary-grid">
          <h3 className="summary-title">📊 ملخص سريع</h3>
          <div className="summary-items">
            {summary.map(({ id, name, total }) => (
              <div key={id} className="summary-item">
                <span>{name}</span>
                <strong>{formatNumber(total)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {resourcesData.map((resource) => (
        <div key={resource.id} className="card calc-section">
          <h2>{resource.name}</h2>

          {mode === 'detailed' ? (
            <>
              <div className="resource-header-row">
                <span>الحجم</span>
                <span>عادي</span>
                <span>🔒 آمن</span>
              </div>
              {resource.units.map((unit) => (
                <div key={unit} className="resource-unit-row">
                  <span className="resource-unit-label">{formatNumber(unit)}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="field-input"
                    style={{ padding: '10px' }}
                    value={values[`${resource.id}_${unit}`] || ''}
                    onChange={(e) => setVal(resource.id, unit, '', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="field-input"
                    style={{ padding: '10px' }}
                    value={values[`${resource.id}_${unit}_safe`] || ''}
                    onChange={(e) => setVal(resource.id, unit, '_safe', e.target.value)}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="manual-resource-row">
              <InputField
                label={`إجمالي ${resource.name}`}
                name={`manual-${resource.id}`}
                type="text"
                value={manual[resource.id].amount}
                onChange={(e) =>
                  setManual((m) => ({
                    ...m,
                    [resource.id]: { ...m[resource.id], amount: e.target.value },
                  }))
                }
                placeholder="520.6 أو 1500000"
                hint="يمكنك كتابة 520.6M مباشرة أو اختيار الوحدة"
              />
              <InputField
                label="الوحدة"
                name={`unit-${resource.id}`}
                as="select"
                value={manual[resource.id].unit}
                onChange={(e) =>
                  setManual((m) => ({
                    ...m,
                    [resource.id]: { ...m[resource.id], unit: e.target.value },
                  }))
                }
                options={UNIT_OPTIONS}
              />
            </div>
          )}

          <button type="button" className="btn btn-outline btn-sm" onClick={() => calculateOne(resource)}>
            احسب {resource.name}
          </button>
          {results[resource.id] && (
            <div className="result-box">
              إجمالي {resource.name}: {results[resource.id]}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
