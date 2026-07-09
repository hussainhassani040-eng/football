import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env (NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY).')
  process.exit(1)
}


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const excelPath = process.argv[2] || 'C:/Users/lenovo/Downloads/LaLiga_2025-26_Teams_Database.xlsx'
let TABLE_NAME = 'teams'

if (!fs.existsSync(excelPath)) {
  console.error('Excel file not found at', excelPath)
  process.exit(1)
}

function findKey(keys, patterns) {
  const lower = keys.map(k => k.toLowerCase().trim())
  for (const p of patterns) {
    const idx = lower.findIndex(k => k.includes(p))
    if (idx !== -1) return keys[idx]
  }
  return null
}

async function main() {
  console.log('Reading Excel:', excelPath)
  const workbook = xlsx.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null })

  if (!rows || rows.length === 0) {
    console.error('No rows found in Excel sheet')
    process.exit(1)
  }

  const headers = Object.keys(rows[0])

  const nameKey = findKey(headers, ['name', 'team', 'club', 'equipo'])
  const slugKey = findKey(headers, ['slug'])
  const stadiumKey = findKey(headers, ['stadium', 'estadio'])
  const cityKey = findKey(headers, ['city', 'ciudad'])
  const foundedKey = findKey(headers, ['founded', 'year', 'anno', 'fundado'])
  const logoKey = findKey(headers, ['logo', 'crest', 'badge', 'logo_url', 'logo url'])
  const websiteKey = findKey(headers, ['website', 'site', 'url'])

  if (!nameKey) {
    console.error('Could not determine the team name column from Excel headers:', headers)
    process.exit(1)
  }

  // detect table name: try common variants until one works
  const candidates = ['teams', 'Teams', 'Teams']
  let detected = null
  for (const cand of candidates) {
    try {
      const { data, error } = await supabase.from(cand).select('id').limit(1)
      if (!error) {
        detected = cand
        break
      }
      // if error mentions schema cache or not found, try next
    } catch (e) {
      // ignore and try next
    }
  }

  if (!detected) {
    console.error('Could not find a usable `teams` table. Tried:', candidates.join(', '))
    process.exit(1)
  }

  TABLE_NAME = detected
  console.log('Using table:', TABLE_NAME)

  // detect which columns exist in the target table by attempting selects
  const possibleCols = ['slug', 'name', 'team', 'club', 'team_name', 'title', 'fullname', 'stadium', 'city', 'founded', 'logo', 'website']
  const existingCols = {}
  for (const col of possibleCols) {
    try {
      const { data: d, error: e } = await supabase.from(TABLE_NAME).select(col).limit(1)
      if (!e) existingCols[col] = true
    } catch (e) {
      // ignore
    }
  }

  console.log('Detected columns on', TABLE_NAME + ':', Object.keys(existingCols).join(', ') || '(name only)')

  let inserted = 0
  let skipped = 0
  let errors = 0

  for (const row of rows) {
    const name = String(row[nameKey]).trim()
    if (!name) {
      console.warn('Skipping empty name row')
      continue
    }

    const slug = (slugKey && row[slugKey]) ? String(row[slugKey]).trim() : slugify(name, { lower: true, strict: true })

    const teamObj = {}
    // choose which name-like column to use based on detection
    const nameColsPriority = ['name', 'team', 'club', 'team_name', 'title', 'fullname']
    let usedNameCol = null
    for (const nc of nameColsPriority) {
      if (existingCols[nc]) {
        usedNameCol = nc
        teamObj[nc] = name
        break
      }
    }
    if (!usedNameCol) {
      // fallback: include `name` as best-effort
      teamObj.name = name
    }
    if (existingCols.slug) teamObj.slug = slug
    if (existingCols.slug) teamObj.slug = slug
    if (existingCols.stadium && stadiumKey && row[stadiumKey]) teamObj.stadium = String(row[stadiumKey]).trim()
    if (existingCols.city && cityKey && row[cityKey]) teamObj.city = String(row[cityKey]).trim()
    if (existingCols.founded && foundedKey && row[foundedKey]) {
      const v = row[foundedKey]
      const n = Number(v)
      if (!Number.isNaN(n)) teamObj.founded = n
    }
    if (existingCols.logo && logoKey && row[logoKey]) teamObj.logo = String(row[logoKey]).trim()
    if (existingCols.website && websiteKey && row[websiteKey]) teamObj.website = String(row[websiteKey]).trim()

    try {
      // build duplicate check using available columns
      let existing = null
      // build duplicate check using available name-like columns
      const nameChecks = []
      if (existingCols.slug) nameChecks.push(`slug.eq.${slug}`)
      for (const nc of ['name', 'team', 'club', 'team_name', 'title', 'fullname']) {
        if (existingCols[nc]) nameChecks.push(`${nc}.eq.${encodeURIComponent(name)}`)
      }

      if (nameChecks.length > 0) {
        const orString = nameChecks.join(',')
        const { data: d, error: selErr } = await supabase.from(TABLE_NAME).select('id').or(orString).limit(1)
        if (selErr) {
          console.error('Error checking existing team', name, selErr.message || selErr)
          errors++
          continue
        }
        existing = d
      } else {
        // fallback: try select id limit 1 and assume empty table means not existing
        const { data: d, error: selErr } = await supabase.from(TABLE_NAME).select('id').limit(1)
        if (selErr) {
          console.error('Error accessing table for', name, selErr.message || selErr)
          errors++
          continue
        }
        existing = []
      }

      if (existing && existing.length > 0) {
        console.log('Skipping duplicate:', name)
        skipped++
        continue
      }

      const { data: ins, error: insErr } = await supabase.from(TABLE_NAME).insert(teamObj).select()

      if (insErr) {
        console.error('Failed to insert', name, insErr.message || insErr)
        errors++
      } else {
        console.log('Inserted:', name)
        inserted++
      }
    } catch (e) {
      console.error('Unexpected error for', name, e.message || e)
      errors++
    }
  }

  console.log('Import finished. Inserted:', inserted, 'Skipped:', skipped, 'Errors:', errors)

  // Verify count of teams in table
  const { data: all, count, error: cErr } = await supabase.from(TABLE_NAME).select('*', { count: 'exact' })
  if (cErr) {
    console.warn('Could not retrieve teams count:', cErr.message || cErr)
    process.exit(errors > 0 ? 2 : 0)
  }

  console.log('Total teams in `teams` table:', count)

  // If there were 20 inserted or total >= 20, consider success
  if (inserted >= 20 || (count !== null && count >= 20)) {
    console.log('Success: 20 teams are present in the database (or more).')
    process.exit(0)
  }

  console.warn('Warning: Did not detect 20 teams inserted. Inserted:', inserted, 'Total in DB:', count)
  process.exit(3)
}

main()
