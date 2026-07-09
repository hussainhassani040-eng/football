import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const url = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing Supabase credentials.');
  process.exit(1)
}
const supabase = createClient(url, key)

async function inspect () {
  const sample = await supabase.from('teams').select('*').in('league', ['LaLiga', 'La Liga']).limit(1)
  console.log('sample:', JSON.stringify(sample, null, 2))
  const count = await supabase.from('teams').select('slug', { count: 'exact' }).in('league', ['LaLiga', 'La Liga']).limit(1)
  console.log('count:', JSON.stringify(count, null, 2))
  const tests = [
    'name', 'slug', 'team', 'club', 'title', 'fullname', 'short_name', 'stadium', 'city', 'founded', 'country', 'league', 'logo', 'website', 'capacity', 'coach', 'primary_color', 'secondary_color'
  ]
  for (const col of tests) {
    const res = await supabase.from('teams').select(col).in('league', ['LaLiga', 'La Liga']).limit(1)
    console.log(`column ${col}:`, JSON.stringify({ status: res.status, error: res.error?.message || null }, null, 2))
  }
}
inspect().catch(err => { console.error('Error', err.message || err); process.exit(1) })
