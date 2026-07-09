type TeamRecord = Record<string, any>

const TEAM_NAME_KEYS = ['name', 'team', 'club', 'title', 'fullname']

export function normalizeLeagueValue(value?: string | null) {
  if (!value) return 'Unknown'

  const normalized = String(value).trim().toLowerCase()

  const leagueMap: Record<string, string> = {
    'la liga': 'LaLiga',
    'laliga': 'LaLiga',
    'premier league': 'Premier League',
    'premierleague': 'Premier League',
    'champions league': 'Champions League',
    'championsleague': 'Champions League',
    'serie a': 'Serie A',
    'seriea': 'Serie A',
    'international': 'International',
    'bundesliga': 'Bundesliga',
    'ligue 1': 'Ligue 1'
  }

  return leagueMap[normalized] ?? String(value).trim()
}

export function getTeamDisplayName(team?: TeamRecord | null) {
  const foundKey = TEAM_NAME_KEYS.find((key) => typeof team?.[key] === 'string' && team[key].trim())
  return foundKey ? String(team?.[foundKey]).trim() : 'Unknown team'
}

export function getTeamSlug(team?: TeamRecord | null) {
  if (typeof team?.slug === 'string' && team.slug.trim()) {
    return team.slug.trim().toLowerCase()
  }

  const name = getTeamDisplayName(team)
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getTeamLogo(team?: TeamRecord | null) {
  return team?.logo || team?.logo_url || team?.badge_url || team?.image_url || team?.crest || team?.short_name || getTeamDisplayName(team).slice(0, 2).toUpperCase()
}

export function getTeamSummary(team?: TeamRecord | null) {
  return team?.summary || `${getTeamDisplayName(team)} is a featured club in ${normalizeLeagueValue(team?.league)}.`
}

export function getTeamPrimaryColor(team?: TeamRecord | null) {
  return team?.primary_color || team?.primaryColor || '#16A34A'
}

export function getTeamSecondaryColor(team?: TeamRecord | null) {
  return team?.secondary_color || team?.secondaryColor || '#FFFFFF'
}

export function buildTeamCardData(team: TeamRecord | null | undefined, index = 0) {
  const name = getTeamDisplayName(team)
  const league = normalizeLeagueValue(team?.league)
  const slug = getTeamSlug(team)

  return {
    rank: index + 1,
    team: name,
    league,
    country: team?.country || 'N/A',
    form: team?.form || 'N/A',
    summary: getTeamSummary(team),
    logo: getTeamLogo(team),
    slug,
    primary_color: getTeamPrimaryColor(team),
    secondary_color: getTeamSecondaryColor(team),
    source_table: team?.source_table,
    city: team?.city || 'N/A',
    stadium: team?.stadium || 'N/A',
    founded: team?.founded || 'N/A',
    coach: team?.coach || 'N/A',
    website: team?.website || '#',
    capacity: team?.capacity || 'N/A'
  }
}
