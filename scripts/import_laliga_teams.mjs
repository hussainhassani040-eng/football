import dotenv from 'dotenv'
import path from 'path'
import xlsx from 'xlsx'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const excelPath = 'C:/Users/lenovo/Downloads/LaLiga_2025-26_Teams_Database.xlsx'
const tableName = 'Laliga'

const workbook = xlsx.readFile(excelPath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const rows = xlsx.utils.sheet_to_json(sheet, { defval: null })

const normalizedRows = rows.map((row) => ({
  name: row.Name,
  short_name: row['Short Name'],
  slug: row.Slug || slugify(String(row.Name), { lower: true, strict: true }),
  country: row.Country,
  league: row.League || 'LaLiga',
  city: row.City,
  founded: row.Founded,
  stadium: row.Stadium,
  capacity: row.Capacity,
  coach: row.Coach,
  website: row.Website,
  primary_color: row['Primary Color'],
  secondary_color: row['Secondary Color']
}))

const { data: existing, error: existingError } = await supabase.from(tableName).select('slug').limit(100)
if (existingError) {
  console.error(existingError)
  process.exit(1)
}

const existingSlugs = new Set((existing || []).map((item) => item.slug))
const toInsert = normalizedRows.filter((row) => !existingSlugs.has(row.slug))

if (toInsert.length) {
  const { error } = await supabase.from(tableName).insert(toInsert)
  if (error) {
    console.error(error)
    process.exit(1)
  }
}

console.log(JSON.stringify({ inserted: toInsert.length, skipped: normalizedRows.length - toInsert.length, total: normalizedRows.length }, null, 2))
