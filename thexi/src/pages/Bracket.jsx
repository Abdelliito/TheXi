import { useMemo, useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { MatchCardSkeleton } from '../components/common/Skeleton';
import MatchCard from '../components/matches/MatchCard';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { getTeamFlag, makeTeamsById } from '../utils/tournament';

const rounds = [
  { key: 'r32', label: 'Round of 32' },
  { key: 'r16', label: 'Round of 16' },
  { key: 'qf', label: 'Quarter-Finals' },
  { key: 'sf', label: 'Semi-Finals' },
  { key: 'final', label: 'Finals' },
];

function Bracket() {
  const [activeRound, setActiveRound] = useState('r32');
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();
  const teamsById = useMemo(() => makeTeamsById(teams), [teams]);
  const roundGames = games.filter((game) => game.type === activeRound);

  if (gamesError || teamsError) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <ErrorState title="Bracket unavailable" message={gamesError?.message || teamsError?.message} />
      </main>
    );
  }

  const loading = gamesLoading || teamsLoading;

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Tournament Bracket
        </h1>
        <p className="mt-1 text-sm text-gray-400">Track the path of the champions through the knockout stages.</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-800 pb-5">
        {rounds.map((round) => (
          <button
            key={round.key}
            type="button"
            onClick={() => setActiveRound(round.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeRound === round.key
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'border border-gray-800/80 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {round.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <MatchCardSkeleton key={index} />)}
        </div>
      ) : roundGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roundGames.map((game) => (
            <MatchCard
              key={game.id}
              game={game}
              homeFlag={getTeamFlag(teamsById, game.home_team_id)}
              awayFlag={getTeamFlag(teamsById, game.away_team_id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Round not populated yet" message="No matches are scheduled or decided for this knockout round." />
      )}
    </main>
  );
}

export default Bracket;
