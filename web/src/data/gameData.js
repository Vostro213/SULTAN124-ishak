export const resourcesData = [
  {
    name: 'القمح',
    id: 'wheat',
    units: [1000, 10000, 30000, 50000, 150000, 500000, 1500000, 5000000, 15000000, 50000000],
  },
  {
    name: 'الخشب',
    id: 'wood',
    units: [1000, 10000, 30000, 50000, 150000, 500000, 1500000, 5000000, 15000000, 50000000],
  },
  {
    name: 'الحديد',
    id: 'iron',
    units: [150, 1600, 8000, 25000, 80000, 250000, 800000, 2500000, 8000000],
  },
  {
    name: 'الفضة',
    id: 'silver',
    units: [40, 400, 2000, 6250, 20000, 62500, 200000, 625000, 2000000],
  },
  {
    name: 'البلور',
    id: 'crystal',
    units: [100, 500, 1500, 5000, 15000, 50000],
  },
  {
    name: 'حجر النيزك',
    id: 'meteor',
    units: [1, 5, 10, 50, 100, 500, 1000, 5000],
  },
  {
    name: 'الكهرمان',
    id: 'amber',
    units: [1, 5, 10, 50, 100, 500, 1000],
  },
]

export const speedMinutes = [1, 5, 15, 30, 60, 120, 480, 720, 1440]

export const speedTypes = [
  { id: 'free', label: 'تسريعات حرة' },
  { id: 'troop', label: 'تسريعات الجنود' },
  { id: 'build', label: 'تسريعات البناء' },
  { id: 'tech', label: 'تسريعات العلوم' },
]

export const troopData = {
  t1: { id: 't1', name: 'جندي 1', cost: { wheat: 100, wood: 80, iron: 30, silver: 5, crystal: 0, meteor: 0 }, time: 8 },
  t2: { id: 't2', name: 'جندي 2', cost: { wheat: 120, wood: 100, iron: 40, silver: 6, crystal: 0, meteor: 0 }, time: 9 },
  t3: { id: 't3', name: 'جندي 3', cost: { wheat: 150, wood: 120, iron: 50, silver: 8, crystal: 0, meteor: 0 }, time: 10 },
  t4: { id: 't4', name: 'جندي 4', cost: { wheat: 180, wood: 150, iron: 60, silver: 10, crystal: 0, meteor: 0 }, time: 11 },
  t5: { id: 't5', name: 'جندي 5', cost: { wheat: 220, wood: 180, iron: 75, silver: 12, crystal: 0, meteor: 0 }, time: 12 },
  t6: { id: 't6', name: 'جندي 6', cost: { wheat: 260, wood: 220, iron: 85, silver: 15, crystal: 0, meteor: 0 }, time: 13 },
  t7: { id: 't7', name: 'جندي 7', cost: { wheat: 300, wood: 260, iron: 100, silver: 18, crystal: 0, meteor: 0 }, time: 14 },
  t8: { id: 't8', name: 'جندي 8', cost: { wheat: 350, wood: 300, iron: 115, silver: 20, crystal: 0, meteor: 0 }, time: 15 },
  t9: { id: 't9', name: 'جندي 9', cost: { wheat: 400, wood: 350, iron: 125, silver: 22, crystal: 0, meteor: 0 }, time: 16 },
  t10: { id: 't10', name: 'جندي 10', cost: { wheat: 500, wood: 400, iron: 150, silver: 25, crystal: 0, meteor: 0 }, time: 18 },
  t11: { id: 't11', name: 'جندي 11', cost: { wheat: 700, wood: 500, iron: 200, silver: 28, crystal: 0, meteor: 0 }, time: 20 },
  t12: { id: 't12', name: 'جندي 12', cost: { wheat: 850, wood: 600, iron: 250, silver: 30, crystal: 10, meteor: 0 }, time: 22 },
  t12_super: { id: 't12_super', name: 'جندي خارق 12', cost: { wheat: 997, wood: 497, iron: 129, silver: 30, crystal: 20, meteor: 0 }, time: 21 },
  armor: { id: 'armor', name: 'جندي مدرع', cost: { wheat: 1300, wood: 800, iron: 300, silver: 50, crystal: 45, meteor: 8 }, time: 28 },
}

export const servers = Array.from({ length: 600 }, (_, i) => `السيرفر ${i + 1}`)
