import { useState } from 'react'
import InputField from '../components/InputField'
import { troopData } from '../data/gameData'
import { formatTime, parseResourceInput } from '../utils/format'

const troopOptions = [
  { value: '', label: 'اختر نوع الجندي' },
  ...Object.entries(troopData).map(([key, t]) => ({ value: key, label: t.name })),
]

const RESOURCE_IDS = ['wheat', 'wood', 'iron', 'silver', 'crystal', 'meteor']
const UNIT_OPTIONS = [
  { id: 'K', label: 'K' },
  { id: 'M', label: 'M' },
  { id: 'B', label: 'B' },
]

export default function TrainingCalculator() {
  const [form, setForm] = useState({
    troopType: '',
    manualTime: '',
    wheat: '',
    wood: '',
    iron: '',
    silver: '',
    crystal: '',
    meteor: '',
    discount: '',
    boostHours: '',
  })
  const [units, setUnits] = useState(() =>
    Object.fromEntries(RESOURCE_IDS.map((id) => [id, 'M'])),
  )
  const [result, setResult] = useState(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const setUnit = (id) => (e) => setUnits((u) => ({ ...u, [id]: e.target.value }))

  const selectedData = form.troopType ? troopData[form.troopType] : null
  const showCrystal = selectedData && selectedData.cost.crystal > 0
  const showMeteor = selectedData && selectedData.cost.meteor > 0

  const getDiscountMult = () => 1 - (Math.min(parseFloat(form.discount) || 0, 40) / 100)

  const formatCost = (val) => {
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + 'M'
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
    return val.toLocaleString('ar')
  }

  const resourceMeta = {
    wheat: { label: 'القمح', placeholder: '433.5' },
    wood: { label: 'الخشب', placeholder: '1.2' },
    iron: { label: 'الحديد', placeholder: '69.1' },
    silver: { label: 'الفضة', placeholder: '298.5' },
    crystal: { label: 'البلور', placeholder: '150' },
    meteor: { label: 'حجر النيزك', placeholder: '0.5' },
  }

  const calculate = () => {
    const data = troopData[form.troopType]
    if (!data) {
      alert('يرجى اختيار نوع الجندي')
      return
    }

    const discount = Math.min(parseFloat(form.discount) || 0, 40)
    const mult = getDiscountMult()

    const customTime = parseFloat(form.manualTime)
    const trainingTime = !isNaN(customTime) && customTime > 0 ? customTime : data.time

    const wheat = parseResourceInput(form.wheat, units.wheat)
    const wood = parseResourceInput(form.wood, units.wood)
    const iron = parseResourceInput(form.iron, units.iron)
    const silver = parseResourceInput(form.silver, units.silver)
    const crystal = parseResourceInput(form.crystal, units.crystal)
    const meteor = parseResourceInput(form.meteor, units.meteor)
    const boost = parseFloat(form.boostHours) * 3600 || 0

    const limits = [
      { name: 'القمح', max: Math.floor(wheat / (data.cost.wheat * mult)) },
      { name: 'الخشب', max: Math.floor(wood / (data.cost.wood * mult)) },
      { name: 'الحديد', max: Math.floor(iron / (data.cost.iron * mult)) },
      { name: 'الفضة', max: Math.floor(silver / (data.cost.silver * mult)) },
    ]
    if (data.cost.crystal > 0) limits.push({ name: 'البلور', max: Math.floor(crystal / (data.cost.crystal * mult)) })
    if (data.cost.meteor > 0) limits.push({ name: 'حجر النيزك', max: Math.floor(meteor / (data.cost.meteor * mult)) })
    if (boost > 0) limits.push({ name: 'التسريعات', max: Math.floor(boost / trainingTime) })

    const maxTrainable = Math.min(...limits.map((l) => l.max))
    const bottleneck = limits.find((l) => l.max === maxTrainable)
    const usedBoost = maxTrainable * trainingTime

    const costs = [
      { label: 'القمح', value: Math.round(data.cost.wheat * mult), base: data.cost.wheat },
      { label: 'الخشب', value: Math.round(data.cost.wood * mult), base: data.cost.wood },
      { label: 'الحديد', value: Math.round(data.cost.iron * mult), base: data.cost.iron },
      { label: 'الفضة', value: Math.round(data.cost.silver * mult), base: data.cost.silver },
    ]
    if (data.cost.crystal > 0) costs.push({ label: 'البلور', value: Math.round(data.cost.crystal * mult), base: data.cost.crystal })
    if (data.cost.meteor > 0) costs.push({ label: 'حجر النيزك', value: Math.round(data.cost.meteor * mult), base: data.cost.meteor })

    const bottleneckCost = costs.find((c) => c.label === bottleneck?.name)
    const usedOfBottleneck = maxTrainable * (bottleneckCost?.base || 0) * mult
    const resourcesMap = { القمح: wheat, الخشب: wood, الحديد: iron, الفضة: silver, البلور: crystal, 'حجر النيزك': meteor, التسريعات: boost }
    const bottleneckResource = resourcesMap[bottleneck?.name] || 0
    const nextTroopCost = (bottleneckCost?.base || 0) * mult
    const shortageForOneMore = bottleneckResource > 0 ? Math.round(Math.max(0, (maxTrainable + 1) * nextTroopCost - bottleneckResource)) : 0

    setResult({
      name: data.name,
      id: data.id,
      count: maxTrainable,
      bottleneck: bottleneck?.name,
      bottleneckShortage: shortageForOneMore,
      usedBoost: boost > 0 ? formatTime(usedBoost) : null,
      remainingBoost: boost > 0 ? formatTime(Math.max(0, boost - usedBoost)) : null,
      discount: discount > 0 ? discount : null,
      costs,
      trainingTime,
    })
  }

  return (
    <>
      <div className="page-header">
        <h1>👮 حاسبة التدريب</h1>
        <p>كم جندي يمكنك تدريبه؟ الموارد بالمليون (M)</p>
      </div>

      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <InputField label="نوع الجندي" name="troopType" as="select" value={form.troopType} onChange={set('troopType')} options={troopOptions} required />

        {selectedData && (
          <div className="troop-preview">
            <div className="troop-image-frame">
              <img
                src={`/images/${selectedData.id}.jpg`}
                alt={selectedData.name}
                className="troop-image"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="troop-emoji-fallback">
                {selectedData.id === 'armor' ? '🛡️' : selectedData.id === 't12_super' ? '⚡' : '👮'}
              </div>
            </div>
            <div className="troop-cost-summary">
              <h3>{selectedData.name}</h3>
              <div className="cost-per-unit">
                <span className="cost-label">تكلفة الجندي الواحد:</span>
                {Object.entries(selectedData.cost).map(([key, val]) => {
                  if (val === 0) return null
                  const resourceNames = { wheat: '🌾', wood: '🪵', iron: '⛏️', silver: '🪙', crystal: '💎', meteor: '🪨' }
                  return (
                    <span key={key} className="cost-chip">
                      {resourceNames[key] || key} {formatCost(val)}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <InputField label="وقت التدريب (ثواني)" name="manualTime" type="number" value={form.manualTime} onChange={set('manualTime')} placeholder="حسب قلعتك — اختياري" hint="اتركه فارغاً لاستخدام الوقت الافتراضي" min="0" step="0.1" />

        <div className="form-section-title">حدث التخفيض</div>
        <InputField label="تخفيض % (0-40)" name="discount" type="number" value={form.discount} onChange={set('discount')} placeholder="10" hint="نسبة التخفيض من حدث اللعبة" min="0" max="40" step="1" />

        <div className="form-section-title">الموارد</div>

        {['wheat', 'wood', 'iron', 'silver'].map((id) => (
          <div key={id} className="resource-unit-row">
            <span className="resource-label">{resourceMeta[id].label}</span>
            <input
              type="number"
              className="field-input"
              placeholder={resourceMeta[id].placeholder}
              value={form[id]}
              onChange={set(id)}
              min="0"
              step="0.01"
            />
            <select className="unit-select" value={units[id]} onChange={setUnit(id)}>
              {UNIT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}

        {showCrystal && (
          <div className="resource-unit-row">
            <span className="resource-label">البلور</span>
            <input
              type="number"
              className="field-input"
              placeholder={resourceMeta.crystal.placeholder}
              value={form.crystal}
              onChange={set('crystal')}
              min="0"
              step="0.01"
            />
            <select className="unit-select" value={units.crystal} onChange={setUnit('crystal')}>
              {UNIT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        )}

        {showMeteor && (
          <div className="resource-unit-row">
            <span className="resource-label">حجر النيزك</span>
            <input
              type="number"
              className="field-input"
              placeholder={resourceMeta.meteor.placeholder}
              value={form.meteor}
              onChange={set('meteor')}
              min="0"
              step="0.01"
            />
            <select className="unit-select" value={units.meteor} onChange={setUnit('meteor')}>
              {UNIT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-section-title" style={{ marginTop: 16 }}>التسريعات</div>
        <InputField label="التسريعات (ساعات)" name="boostHours" type="number" value={form.boostHours} onChange={set('boostHours')} placeholder="48" min="0" step="0.1" />

        <button type="button" className="btn btn-primary btn-block" onClick={calculate}>
          احسب
        </button>

        {result && (
          <div className="result-box" style={{ marginTop: 24, textAlign: 'right' }}>
            {result.discount && <p>🔥 حدث التخفيض: <strong>{result.discount}%</strong></p>}
            <p>👮 يمكنك تدريب <strong>{result.count.toLocaleString('ar')}</strong> من {result.name}</p>
            <p>⚠️ العائق: <strong>{result.bottleneck}</strong></p>
            {result.bottleneckShortage > 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                💡 تحتاج <strong>{result.bottleneckShortage.toLocaleString('ar')}</strong> إضافية من {result.bottleneck} لتدريب جندي إضافي واحد
              </p>
            )}
            {result.usedBoost && <p>🕑 الوقت المستهلك: {result.usedBoost}</p>}
            {result.remainingBoost && <p>🔋 المتبقي: {result.remainingBoost}</p>}

            {result.costs && (
              <div className="per-unit-cost">
                <div className="per-unit-title">💰 تكلفة الجندي الواحد:</div>
                <div className="per-unit-grid">
                  {result.costs.map((c) => (
                    <div key={c.label} className="per-unit-item">
                      <span className="per-unit-label">{c.label}</span>
                      <span className="per-unit-value">{c.value.toLocaleString('ar')}</span>
                    </div>
                  ))}
                  <div className="per-unit-item">
                    <span className="per-unit-label">الوقت</span>
                    <span className="per-unit-value">{result.trainingTime} ث</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
