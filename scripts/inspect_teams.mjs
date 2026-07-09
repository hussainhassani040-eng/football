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
  const tableNames = ['Teams', 'teams', 'Laliga', 'LaLiga']
  for (const table of tableNames) {
    try {
      const sample = await supabase.from(table).select('*').limit(1)
      console.log('TABLE:', table)
      console.log(JSON.stringify(sample, null, 2))
    } catch (err) {
      console.error('TABLE ERROR', table, err.message || err)
    }
  }

  try {
    const { data, error } = await supabase.from('Teams').select('id').limit(1)
    console.log('Teams id query', { data, error: error?.message || error })
  } catch (err) {
    console.error('Teams select error', err.message || err)
  }
}

inspect().catch(err => {
  console.error('Unexpected inspection error', err)
  process.exit(1)
})
