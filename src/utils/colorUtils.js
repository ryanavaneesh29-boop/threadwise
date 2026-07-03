export const neutralColors = [
  'White',
  'Black',
  'Grey',
  'Beige',
  'Brown',
  'Navy',
  'Silver',
  'Gold',
  'Ivory',
  'Cream',
  'Camel',
  'Charcoal',
  'Taupe'
]

const families = {
  White: 'neutral',
  Black: 'neutral',
  Grey: 'neutral',
  Beige: 'neutral',
  Brown: 'earth',
  Navy: 'cool',
  Silver: 'metal',
  Gold: 'metal',
  Ivory: 'neutral',
  Cream: 'neutral',
  Camel: 'earth',
  Charcoal: 'neutral',
  Taupe: 'earth',
  Blue: 'cool',
  Olive: 'earth',
  Green: 'earth',
  Red: 'warm',
  Orange: 'warm'
}

const complements = {
  Blue: ['White', 'Cream', 'Orange', 'Brown', 'Beige', 'Taupe'],
  Red: ['Black', 'White', 'Navy', 'Gold', 'Cream'],
  Green: ['White', 'Brown', 'Cream', 'Black', 'Gold'],
  Olive: ['White', 'Cream', 'Black', 'Brown', 'Taupe'],
  Orange: ['Blue', 'Navy', 'White', 'Cream'],
  Black: ['White', 'Grey', 'Silver', 'Charcoal', 'Cream'],
  White: ['Black', 'Blue', 'Navy', 'Brown', 'Silver'],
  Cream: ['Brown', 'Black', 'Navy', 'Gold', 'Olive'],
  Navy: ['White', 'Cream', 'Brown', 'Gold', 'Beige'],
  Brown: ['White', 'Cream', 'Blue', 'Olive', 'Gold']
}

const clashPairs = [
  ['Red', 'Orange'],
  ['Red', 'Olive'],
  ['Green', 'Orange'],
  ['Blue', 'Green']
]

export function normalizeColor(color) {
  if (!color) return ''
  const lower = color.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export function isNeutral(color) {
  return neutralColors.includes(normalizeColor(color))
}

export function getColorFamily(color) {
  return families[normalizeColor(color)] || 'accent'
}

export function areColorsCompatible(baseColor, candidateColor) {
  const base = normalizeColor(baseColor)
  const candidate = normalizeColor(candidateColor)

  if (!base || !candidate) return true
  if (base === candidate) return true
  if (isNeutral(base) || isNeutral(candidate)) return true
  if ((complements[base] || []).includes(candidate)) return true
  if ((complements[candidate] || []).includes(base)) return true

  return getColorFamily(base) === getColorFamily(candidate)
}

export function colorScore(baseColor, candidateColor) {
  const base = normalizeColor(baseColor)
  const candidate = normalizeColor(candidateColor)

  if (!base || !candidate) return 0
  if (base === candidate) return 8
  if (isNeutral(candidate)) return 18
  if ((complements[base] || []).includes(candidate)) return 24
  if ((complements[candidate] || []).includes(base)) return 20
  if (getColorFamily(base) === getColorFamily(candidate)) return 10
  if (clashPairs.some(([a, b]) => (a === base && b === candidate) || (a === candidate && b === base))) return -18

  return -4
}

export function colorSwatch(color) {
  const palette = {
    White: '#f8fafc',
    Black: '#111827',
    Grey: '#9ca3af',
    Beige: '#d6c6a8',
    Brown: '#7c4a2d',
    Navy: '#1e3a5f',
    Silver: '#cbd5e1',
    Gold: '#d5a633',
    Ivory: '#fffbea',
    Cream: '#f4ead2',
    Camel: '#c1915b',
    Charcoal: '#374151',
    Taupe: '#a79889',
    Blue: '#2563eb',
    Olive: '#64713d',
    Green: '#15803d',
    Red: '#dc2626',
    Orange: '#f97316'
  }

  return palette[normalizeColor(color)] || '#94a3b8'
}
