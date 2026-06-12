export const isFinishedMatch = (game) =>
  game?.finished === 'TRUE' || game?.time_elapsed === 'finished';

export const isLiveMatch = (game) => {
  const elapsed = String(game?.time_elapsed || '').toLowerCase();
  return Boolean(elapsed && elapsed !== 'finished' && elapsed !== 'notstarted' && elapsed !== 'null');
};

export const getTeamName = (team) => team?.name_en || team?.name || team?.country || 'TBD';

export const getMatchTeamName = (game, side) =>
  game?.[`${side}_team_name_en`] || game?.[`${side}_team_label`] || 'TBD';

export const normalizeId = (id) => String(id ?? '');

export const makeTeamsById = (teams = []) =>
  teams.reduce((map, team) => {
    map[normalizeId(team.id)] = team;
    return map;
  }, {});

export const getTeamFlag = (teamsById, id) => teamsById[normalizeId(id)]?.flag;

export const parseScorers = (scorersStr) => {
  if (!scorersStr || scorersStr === 'null') return [];

  try {
    const parsed = JSON.parse(scorersStr);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
    if (parsed && typeof parsed === 'object') return Object.values(parsed).filter(Boolean);
  } catch {
    // The API sometimes returns a stringified list with curly quotes.
  }

  return String(scorersStr)
    .replace(/[{}[\]"“”]/g, '')
    .split(',')
    .map((scorer) => scorer.trim())
    .filter(Boolean);
};

export const getMatchDate = (game) => {
  const value = game?.local_date || game?.date || game?.datetime;
  if (!value) return null;

  const normalized = String(value).replace(' ', 'T');
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const [datePart, timePart = '00:00'] = String(value).split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const fallback = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

export const formatMatchDate = (game, options = {}) => {
  const date = getMatchDate(game);
  if (!date) return game?.local_date || 'Date TBA';

  return new Intl.DateTimeFormat('en-PK', {
    timeZone: 'Asia/Karachi',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  }).format(date);
};

export const calculateStandings = (teams = [], games = []) => {
  const standingsMap = {};

  teams.forEach((team) => {
    standingsMap[normalizeId(team.id)] = {
      id: team.id,
      name: getTeamName(team),
      flag: team.flag,
      group: team.groups || '-',
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    };
  });

  games.forEach((game) => {
    if (game.type !== 'group' || !isFinishedMatch(game)) return;

    const home = standingsMap[normalizeId(game.home_team_id)];
    const away = standingsMap[normalizeId(game.away_team_id)];
    const homeScore = Number.parseInt(game.home_score, 10);
    const awayScore = Number.parseInt(game.away_score, 10);

    if (!home || !away || Number.isNaN(homeScore) || Number.isNaN(awayScore)) return;

    home.played += 1;
    away.played += 1;
    home.gf += homeScore;
    home.ga += awayScore;
    away.gf += awayScore;
    away.ga += homeScore;

    if (homeScore > awayScore) {
      home.won += 1;
      home.pts += 3;
      away.lost += 1;
    } else if (homeScore < awayScore) {
      away.won += 1;
      away.pts += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.pts += 1;
      away.pts += 1;
    }
  });

  return Object.values(standingsMap)
    .map((team) => ({ ...team, gd: team.gf - team.ga }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name));
};

export const groupStandings = (standings = []) =>
  standings.reduce((groups, team) => {
    if (!groups[team.group]) groups[team.group] = [];
    groups[team.group].push(team);
    return groups;
  }, {});
