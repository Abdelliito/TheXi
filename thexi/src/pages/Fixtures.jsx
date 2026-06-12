import { useMemo, useState } from 'react';
import ErrorState from '../components/common/ErrorState';
import { MatchCardSkeleton } from '../components/common/Skeleton';
import MatchCard from '../components/matches/MatchCard';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { getTeamFlag, isFinishedMatch, isLiveMatch, makeTeamsById } from '../utils/tournament';

function Fixtures() {
  const [filter, setFilter] = useState('all');
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();

  const teamsById = useMemo(() => makeTeamsById(teams), [teams]);
  const filteredGames = useMemo(() => {
    if (filter === 'live') return games.filter(isLiveMatch);
    if (filter === 'upcoming') return games.filter((game) => !isFinishedMatch(game) && !isLiveMatch(game));
    if (filter === 'finished') return games.filter(isFinishedMatch);
    return games;
  }, [filter, games]);

  if (gamesError || teamsError) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <ErrorState title="Fixtures unavailable" message={gamesError?.message || teamsError?.message} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Fixtures & Results
          </h1>
          <p className="mt-1 text-sm text-gray-400">Track every group stage match and knockout clash.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'live', 'upcoming', 'finished'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                filter === item
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'border border-gray-800 bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {gamesLoading || teamsLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => <MatchCardSkeleton key={index} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <MatchCard
              key={game.id}
              game={game}
              homeFlag={getTeamFlag(teamsById, game.home_team_id)}
              awayFlag={getTeamFlag(teamsById, game.away_team_id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Fixtures;
