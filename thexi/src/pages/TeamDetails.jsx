import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import FavoriteButton from '../components/common/FavoriteButton';
import { Skeleton } from '../components/common/Skeleton';
import MatchCard from '../components/matches/MatchCard';
import { useFavorites } from '../hooks/useFavorites';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { calculateStandings, getTeamName, makeTeamsById, normalizeId } from '../utils/tournament';

function TeamDetails() {
  const { id } = useParams();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { isTeamFavorite, toggleFavoriteTeam } = useFavorites();

  if (teamsLoading || gamesLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-10 w-56" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </main>
    );
  }

  if (teamsError || gamesError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState message={teamsError?.message || gamesError?.message} />
      </main>
    );
  }

  const team = teams.find((item) => normalizeId(item.id) === normalizeId(id));
  if (!team) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ErrorState title="Team not found" message="That team is not available in the tournament feed." />
      </main>
    );
  }

  const favorite = isTeamFavorite(team.id);
  const teamsById = makeTeamsById(teams);
  const teamMatches = games.filter(
    (game) => normalizeId(game.home_team_id) === normalizeId(team.id) || normalizeId(game.away_team_id) === normalizeId(team.id),
  );
  const standing = calculateStandings(teams, games).find((item) => normalizeId(item.id) === normalizeId(team.id));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/teams" className="text-sm font-semibold text-purple-400 hover:text-purple-300">
          Back to teams
        </Link>
        <FavoriteButton
          active={favorite}
          onClick={() => toggleFavoriteTeam(team.id)}
          label={favorite ? 'Remove team from favorites' : 'Add team to favorites'}
        />
      </div>

      <section className="grid gap-6 rounded-xl border border-gray-800 bg-[#111827] p-6 shadow-2xl md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-gray-800 bg-gray-950/50 p-6 md:w-64">
          {team.flag ? <img src={team.flag} alt={getTeamName(team)} className="max-h-28 max-w-full object-contain" /> : null}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Group {team.groups || '-'}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">{getTeamName(team)}</h1>
          <p className="mt-2 text-sm text-gray-400">FIFA code: {team.fifa_code || 'TBA'}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Played" value={standing?.played ?? 0} />
            <Stat label="Wins" value={standing?.won ?? 0} />
            <Stat label="Goal diff" value={standing?.gd > 0 ? `+${standing.gd}` : standing?.gd ?? 0} />
            <Stat label="Points" value={standing?.pts ?? 0} />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">Matches</h2>
          <p className="mt-1 text-sm text-gray-500">Complete fixture list for {getTeamName(team)}.</p>
        </div>

        {teamMatches.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMatches.map((game) => (
              <MatchCard
                key={game.id}
                game={game}
                homeFlag={teamsById[normalizeId(game.home_team_id)]?.flag}
                awayFlag={teamsById[normalizeId(game.away_team_id)]?.flag}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No fixtures yet" message="This team's schedule has not been published in the feed." />
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default TeamDetails;
