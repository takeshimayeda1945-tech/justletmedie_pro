import { query } from './db.js'

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'number') return value
  const cleaned = String(value).replace(/,/g, '').replace(/\s*บาท\s*/gi, '').trim()
  if (cleaned === '') return null
  const numeric = Number(cleaned)
  return Number.isNaN(numeric) ? null : numeric
}

const buildAbsoluteUrls = (items, host) => {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    if (typeof item !== 'string' || item.trim() === '') return ''
    if (/^https?:\/\//i.test(item)) return item
    return `${host}/${item.replace(/^\//, '')}`
  })
}

const formatPriceText = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return ''
  return new Intl.NumberFormat('th-TH').format(Number(value)) + ' บาท'
}

const mapRowToProperty = (row, host) => {
  const rawImages = row.images || '[]'
  const parsedImages = typeof rawImages === 'string' ? JSON.parse(rawImages || '[]') : rawImages
  const imageUrls = buildAbsoluteUrls(parsedImages, host)
  const priceValue = parseNumber(row.price) ?? 0
  const rooms = row.rooms || `${row.floors || 0} ชั้น ${row.bedrooms || 0} ห้องนอน ${row.bathrooms || 0} ห้องน้ำ | ${row.land_size || 0} ตร.ม.`
  const dateText = row.post_at ? new Date(row.post_at).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
  const saleTypeValue = row.sale_type || ''
  const priceSale = saleTypeValue === 'ขาย' ? formatPriceText(priceValue) : ''
  const priceRent = saleTypeValue === 'เช่า' ? formatPriceText(priceValue) : ''
  const rawNearbyPlaces = row.nearby_places || '[]'
  const parsedNearbyPlaces = typeof rawNearbyPlaces === 'string' ? JSON.parse(rawNearbyPlaces || '[]') : rawNearbyPlaces

  return {
    id: row.ID,
    name: row.name,
    address: row.address,
    image: imageUrls[0] || '',
    images: imageUrls,
    rooms,
    date: dateText,
    price: formatPriceText(priceValue),
    priceNumber: priceValue,
    priceSale,
    priceRent,
    type: row.property_type || '',
    propertyType: row.property_type || '',
    saleType: saleTypeValue,
    sale_type: saleTypeValue,
    landSize: row.land_size !== null ? String(row.land_size) : '',
    land_size: row.land_size !== null ? row.land_size : null,
    floor: row.floors !== null ? String(row.floors) : '',
    floors: row.floors !== null ? row.floors : null,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    description: row.description || '',
    latitude: row.latitude,
    longitude: row.longitude,
    nearbyPlaces: Array.isArray(parsedNearbyPlaces) ? parsedNearbyPlaces : []
  }
}

export const getAllProperties = async (host) => {
  const rows = await query('SELECT * FROM property ORDER BY post_at DESC')
  return rows.map((row) => mapRowToProperty(row, host))
}

export const getPropertyById = async (id, host) => {
  const rows = await query('SELECT * FROM property WHERE ID = ?', [id])
  if (!rows.length) return null
  return mapRowToProperty(rows[0], host)
}

export const createProperty = async ({
  name,
  address,
  images,
  price,
  propertyType,
  saleType,
  landSize,
  floor,
  bedrooms,
  bathrooms,
  description,
  latitude,
  longitude,
  nearbyPlaces
}, host) => {
  const priceValue = parseNumber(price)
  const landSizeValue = parseNumber(landSize) ?? 0
  const floorValue = parseNumber(floor) ?? 0
  const bedroomValue = parseNumber(bedrooms) ?? 0
  const bathroomValue = parseNumber(bathrooms) ?? 0

  const nextIdRows = await query('SELECT COALESCE(MAX(ID), 0) + 1 AS nextId FROM property')
  const nextId = nextIdRows[0]?.nextId ?? 1

  const sellerIdRows = await query(
    'SELECT id FROM users WHERE role_id IN (2, 3) AND status IN (?, ?) ORDER BY id LIMIT 1',
    ['Active', 'active']
  )
  const sellerId = sellerIdRows[0]?.id ?? 1

  const jsonImages = JSON.stringify(Array.isArray(images) ? images : [])
  const nearbyPlacesValue = Array.isArray(nearbyPlaces)
    ? nearbyPlaces
    : typeof nearbyPlaces === 'string'
      ? JSON.parse(nearbyPlaces || '[]')
      : []
  const jsonNearbyPlaces = JSON.stringify(Array.isArray(nearbyPlacesValue) ? nearbyPlacesValue : [])

  const insertSql = `INSERT INTO property
    (ID, name, images, price, address, province, district, subdistrict, bedrooms, bathrooms, land_size, floors, property_type, sale_type, description, detail, latitude, longitude, nearby_places, seller_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

  await query(insertSql, [
    nextId,
    name,
    jsonImages,
    priceValue,
    address,
    '',
    '',
    '',
    bedroomValue,
    bathroomValue,
    landSizeValue,
    floorValue,
    propertyType,
    saleType,
    description || '',
    description || '',
    latitude ?? null,
    longitude ?? null,
    jsonNearbyPlaces,
    sellerId
  ])

  return getPropertyById(nextId, host)
}

const columnExists = async (columnName) => {
  const rows = await query('SHOW COLUMNS FROM property')
  return rows.some((row) => String(row.Field).toLowerCase() === String(columnName).toLowerCase())
}

export const ensurePropertySchema = async () => {
  const columnsToCreate = [
    { name: 'sale_type', sql: 'VARCHAR(50) NULL' },
    { name: 'description', sql: 'TEXT NULL' },
    { name: 'latitude', sql: 'DOUBLE NULL' },
    { name: 'longitude', sql: 'DOUBLE NULL' },
    { name: 'nearby_places', sql: 'TEXT NULL' }
  ]

  for (const col of columnsToCreate) {
    try {
      const exists = await columnExists(col.name)
      if (!exists) {
        await query(`ALTER TABLE property ADD COLUMN ${col.name} ${col.sql}`)
      }
    } catch (error) {
      console.warn(`Property schema migration skipped for ${col.name}:`, error.message)
    }
  }
}
