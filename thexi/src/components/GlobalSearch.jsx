import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { getMatchTeamName, getTeamName } from '../utils/tournament';

function GlobalSearch({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { data: games = [] } = useGames();
  const { data: teams = [] } = useTeams();

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (value.length < 2) return [];

    const teamResults = teams
      .filter((team) =>
        [getTeamName(team), team.fifa_code, team.groups]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(value)),
      )
      .slice(0, 4)
      .map((team) => ({
        id: `team-${team.id}`,
        label: getTeamName(team),
        meta: `Team ${team.fifa_code || ''} Group ${team.groups || '-'}`,
        to: `/team/${team.id}`,
        image: team.flag,
        type: 'Team',
      }));

    const matchResults = games
      .filter((game) =>
        [
          getMatchTeamName(game, 'home'),
          getMatchTeamName(game, 'away'),
          game.group,
          game.local_date,
          game.type,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(value)),
      )
      .slice(0, 5)
      .map((game) => ({
        id: `match-${game.id}`,
        label: `${getMatchTeamName(game, 'home')} vs ${getMatchTeamName(game, 'away')}`,
        meta: `${game.type || 'Match'} ${game.group ? `Group ${game.group}` : ''}`,
        to: `/match/${game.id}`,
        type: 'Match',
      }));

    return [...teamResults, ...matchResults].slice(0, 7);
  }, [games, query, teams]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (results[0]) {
      navigate(results[0].to);
      setQuery('');
      onNavigate?.();
    }
  };

  const close = () => {
    setQuery('');
    onNavigate?.();
  };

  return (
    <form onSubmit={submitSearch} className="relative w-full md:w-72">
      <label className="sr-only" htmlFor="global-search">
        Search teams and matches
      </label>
      <input
        id="global-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        placeholder="Search teams, matches"
        className="h-10 w-full rounded-lg border border-gray-800 bg-gray-950/80 px-3 text-sm text-white outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
      />

      {focused && query.trim().length >= 2 ? (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-gray-800 bg-[#0d1320] shadow-2xl shadow-black/40">
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto py-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={result.to}
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition hover:bg-gray-800/70"
                >
                  <div className="flex h-8 w-10 items-center justify-center rounded bg-gray-900 text-[10px] font-bold uppercase text-purple-300">
                    {result.image ? (
                      <img src={result.image} alt="" className="h-5 w-8 object-contain" />
                    ) : (
                      result.type.slice(0, 1)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-100">{result.label}</p>
                    <p className="truncate text-xs text-gray-500">{result.meta}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-sm text-gray-400">No teams or matches found.</div>
          )}
        </div>
      ) : null}
    </form>
  );
}

export default GlobalSearch;
