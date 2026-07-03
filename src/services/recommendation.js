import clothing from '../data/clothing.json'
import { areColorsCompatible, colorScore, isNeutral, normalizeColor } from '../utils/colorUtils'

const outfitCategories = ['Top', 'Bottom', 'Shoes', 'Jacket', 'Accessory']
const styles = ['Casual', 'Streetwear', 'Smart Casual', 'Formal', 'Minimal', 'Quiet Luxury', 'Outdoor', 'Athleisure', 'Resort']
const occasions = ['Everyday', 'Casual', 'Work', 'Dinner', 'Evening', 'Vacation']
const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All']

const categoryAliases = {
  top: 'Top',
  shirt: 'Top',
  tee: 'Top',
  tshirt: 'Top',
  t: 'Top',
  hoodie: 'Top',
  sweater: 'Top',
  blouse: 'Top',
  polo: 'Top',
  dress: 'Top',
  bottom: 'Bottom',
  bottoms: 'Bottom',
  jeans: 'Bottom',
  trousers: 'Bottom',
  pants: 'Bottom',
  joggers: 'Bottom',
  shorts: 'Bottom',
  skirt: 'Bottom',
  shoes: 'Shoes',
  sneakers: 'Shoes',
  trainers: 'Shoes',
  boots: 'Shoes',
  loafers: 'Shoes',
  heels: 'Shoes',
  jacket: 'Jacket',
  coat: 'Jacket',
  blazer: 'Jacket',
  parka: 'Jacket',
  accessory: 'Accessory',
  accessories: 'Accessory',
  watch: 'Accessory',
  cap: 'Accessory',
  belt: 'Accessory',
  bag: 'Accessory',
  scarf: 'Accessory',
  sunglasses: 'Accessory'
}

export async function recommendOutfit({ query = '', category = '', feedback = [] }) {
  await delay(650)

  const profile = detectProfile(query, category)
  const seed = findSeedItem(query, category, profile)

  if (!seed) {
    throw new Error('No matching wardrobe item found')
  }

  const variants = [
    buildOutfit(seed, profile, 'Best match', feedback),
    buildOutfit(seed, profile, 'Elevated', feedback),
    buildOutfit(seed, profile, 'Relaxed', feedback)
  ].filter(Boolean)

  return {
    seed,
    profile: {
      color: profile.color || seed.color,
      style: profile.style || seed.style,
      occasion: profile.occasion || seed.occasion,
      season: profile.season || seed.season
    },
    outfits: dedupeOutfits(variants),
    rationale: buildRationale(seed, profile)
  }
}

export async function recommendFromPhoto({ file, feedback = [] }) {
  await delay(850)

  const detected = inferPhotoProfile(file)
  const seed = findSeedItem(detected.query, detected.category, detected.profile)

  if (!seed) {
    throw new Error('We could not detect a useful wardrobe item from that photo yet.')
  }

  const outfits = [
    buildOutfit(seed, detected.profile, 'Best ranked', feedback),
    buildOutfit(seed, { ...detected.profile, style: 'Smart Casual' }, 'Sharper layer', feedback),
    buildOutfit(seed, { ...detected.profile, style: 'Minimal' }, 'Clean contrast', feedback),
    buildOutfit(seed, { ...detected.profile, occasion: 'Casual' }, 'Easy fallback', feedback)
  ]
    .filter(Boolean)
    .map((outfit, index) => ({
      ...outfit,
      rank: index + 1,
      reason: explainRank(outfit, seed)
    }))
    .sort((a, b) => b.score - a.score)
    .map((outfit, index) => ({ ...outfit, rank: index + 1 }))

  return {
    seed,
    source: 'photo',
    detected: detected.profile,
    profile: {
      color: detected.profile.color || seed.color,
      style: detected.profile.style || seed.style,
      occasion: detected.profile.occasion || seed.occasion,
      season: detected.profile.season || seed.season
    },
    outfits: dedupeOutfits(outfits),
    rationale: `Photo mode found a likely ${seed.color.toLowerCase()} ${seed.category.toLowerCase()} and ranked owned wardrobe options from best to worst.`
  }
}

export function generateRandomOutfit(feedback = []) {
  const item = clothing[Math.floor(Math.random() * clothing.length)]
  const profile = detectProfile(item.name, item.category)

  return {
    seed: item,
    profile,
    outfits: [buildOutfit(item, profile, 'Random edit', feedback)],
    rationale: buildRationale(item, profile)
  }
}

export function getTrendingOutfits() {
  return [
    buildOutfit(clothing.find((item) => item.name === 'Cream Cashmere Sweater'), {}, 'Quiet luxury'),
    buildOutfit(clothing.find((item) => item.name === 'Black Hoodie'), {}, 'City streetwear'),
    buildOutfit(clothing.find((item) => item.name === 'White Linen Shorts'), {}, 'Resort minimal')
  ].filter(Boolean)
}

function buildOutfit(seed, profile, mood, feedback = []) {
  if (!seed) return null

  const target = {
    color: profile.color || seed.color,
    style: profile.style || seed.style,
    occasion: profile.occasion || seed.occasion,
    season: profile.season || seed.season
  }

  const items = outfitCategories
    .map((category) => {
      if (seed.category === category) return seed

      const candidates = clothing
        .filter((item) => item.category === category)
        .filter((item) => areColorsCompatible(target.color, item.color))
        .map((item) => ({
          item,
          score: scoreItem(item, seed, target, mood, feedback)
        }))
        .sort((a, b) => b.score - a.score)

      return candidates[0]?.item || null
    })
    .filter(Boolean)

  return {
    id: `${mood}-${seed.name}`,
    mood,
    items,
    score: Math.round(items.reduce((sum, item) => sum + scoreItem(item, seed, target, mood, feedback), 0) / items.length)
  }
}

function scoreItem(item, seed, target, mood, feedback = []) {
  let score = 40

  if (item.name === seed.name) score += 20
  if (item.style === target.style) score += 28
  if (item.occasion === target.occasion) score += 24
  if (item.season === target.season || item.season === 'All' || target.season === 'All') score += 16
  if (item.gender === seed.gender || item.gender === 'Unisex' || seed.gender === 'Unisex') score += 8

  score += colorScore(target.color, item.color)

  if (mood === 'Elevated' && ['Formal', 'Smart Casual', 'Quiet Luxury', 'Minimal'].includes(item.style)) score += 12
  if (mood === 'Relaxed' && ['Casual', 'Streetwear', 'Athleisure', 'Resort'].includes(item.style)) score += 12
  if (mood === 'Best match' && item.style === seed.style) score += 8
  if (item.category === 'Shoes' && isNeutral(item.color)) score += 6

  score += feedbackScore(item, mood, feedback)

  return score
}

function inferPhotoProfile(file) {
  const text = (file?.name || '').replace(/\.[^.]+$/, '').toLowerCase()
  const fallbackQueries = ['blue jeans', 'black hoodie', 'white shirt', 'cream sweater', 'red dress']
  const query = text.trim() || fallbackQueries[Math.floor(Math.random() * fallbackQueries.length)]
  const profile = detectProfile(query, '')

  return {
    query,
    category: profile.category,
    profile
  }
}

function detectProfile(query, category) {
  const text = query.toLowerCase()
  const profile = {
    category: category || detectCategory(text),
    color: detectFromList(text, clothing.map((item) => item.color), normalizeColor),
    style: detectFromList(text, styles),
    occasion: detectFromList(text, occasions),
    season: detectFromList(text, seasons)
  }

  if (text.includes('office')) profile.occasion = 'Work'
  if (text.includes('date')) profile.occasion = 'Dinner'
  if (text.includes('party')) profile.occasion = 'Evening'
  if (text.includes('gym')) profile.style = 'Athleisure'
  if (text.includes('minimal')) profile.style = 'Minimal'

  return profile
}

function findSeedItem(query, category, profile) {
  const text = query.trim().toLowerCase()

  if (text) {
    const exact = clothing.find((item) => item.name.toLowerCase() === text)
    if (exact) return exact

    const tokenMatch = clothing
      .map((item) => ({ item, score: queryMatchScore(item, text, profile) }))
      .sort((a, b) => b.score - a.score)[0]

    if (tokenMatch?.score > 0) return tokenMatch.item
  }

  if (category) {
    return clothing.find((item) => item.category === category)
  }

  return clothing.find((item) => item.name === 'Blue Jeans')
}

function queryMatchScore(item, text, profile) {
  const words = text.split(/\s+/).filter(Boolean)
  const itemText = `${item.name} ${item.category} ${item.color} ${item.style} ${item.occasion} ${item.season}`.toLowerCase()

  let score = words.reduce((total, word) => total + (itemText.includes(word) ? 12 : 0), 0)
  if (profile.category && item.category === profile.category) score += 18
  if (profile.color && item.color === profile.color) score += 14
  if (profile.style && item.style === profile.style) score += 10
  if (profile.occasion && item.occasion === profile.occasion) score += 8

  return score
}

function detectCategory(text) {
  const token = text.split(/\s+/).find((word) => categoryAliases[word])
  return token ? categoryAliases[token] : ''
}

function detectFromList(text, list, transform = (value) => value) {
  const unique = [...new Set(list.map(transform))]
  return unique.find((value) => text.includes(value.toLowerCase())) || ''
}

function dedupeOutfits(outfits) {
  const seen = new Set()

  return outfits.filter((outfit) => {
    const key = outfit.items.map((item) => item.name).join('|')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function feedbackScore(item, mood, feedback) {
  return feedback.reduce((total, entry) => {
    const includesItem = entry.items?.includes(item.name)
    const sameMood = entry.mood === mood
    const rating = Number(entry.rating) || 0
    const centered = rating - 3

    if (!includesItem && !sameMood) return total
    return total + centered * (includesItem ? 4 : 2)
  }, 0)
}

function explainRank(outfit, seed) {
  const addOns = outfit.items.filter((item) => item.name !== seed.name).slice(0, 2)
  const names = addOns.map((item) => item.name).join(' and ')

  return names
    ? `${names} scored highest with your current ${seed.category.toLowerCase()} for color, occasion, and learned taste.`
    : `This option keeps your detected ${seed.category.toLowerCase()} as the strongest piece.`
}

function buildRationale(seed, profile) {
  const style = profile.style || seed.style
  const occasion = profile.occasion || seed.occasion
  const season = profile.season || seed.season

  return `Matched around ${seed.color.toLowerCase()} ${seed.category.toLowerCase()} energy, with ${style.toLowerCase()} pieces suited to ${occasion.toLowerCase()} dressing and ${season.toLowerCase()} weather.`
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
