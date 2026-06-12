import { Link } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import { MatchCardSkeleton } from '../components/common/Skeleton';
import MatchCard from '../components/matches/MatchCard';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { getTeamFlag, isFinishedMatch, makeTeamsById } from '../utils/tournament';

function Home() {
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();
  const finishedGames = games.filter(isFinishedMatch);
  const incomingGames = games.filter((game) => !isFinishedMatch(game));
  const teamsById = makeTeamsById(teams);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-purple-500/10 bg-gradient-to-b from-purple-950/20 to-transparent px-4 py-16 text-center shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
          FIFA World Cup 2026 Edition
        </span>
        <h1 className="mb-6 bg-gradient-to-r from-white via-gray-100 to-purple-400 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl">
          The Future of Football Tracking
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Real-time scores, live group calculations, fixture schedules, favorites, and complete tournament context.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/fixtures" className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-500">
            View Fixtures
          </Link>
          <Link to="/standings" className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white">
            Explore Standings
          </Link>
        </div>
      </section>

      {gamesError || teamsError ? (
        <div className="mb-12">
          <ErrorState title="Tournament feed unavailable" message={gamesError?.message || teamsError?.message} />
        </div>
      ) : null}

      <section className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { label: 'Participating Teams', value: teamsLoading ? '...' : teams.length || 48 },
          { label: 'Total Matches Scheduled', value: gamesLoading ? '...' : games.length || 104 },
          { label: 'Matches Completed', value: gamesLoading ? '...' : finishedGames.length },
          { label: 'Upcoming Clashes', value: gamesLoading ? '...' : incomingGames.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-800 bg-[#111827] p-6 shadow-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Recent Results</h2>
            <p className="mt-1 text-xs text-gray-500">Check the latest completed matches.</p>
          </div>
          <Link to="/fixtures" className="text-xs font-bold text-purple-400 hover:text-purple-300">
            See all matches
          </Link>
        </div>

        {gamesLoading || teamsLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <MatchCardSkeleton key={index} />)}
          </div>
        ) : finishedGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {finishedGames.slice(0, 3).map((game) => (
              <MatchCard
                key={game.id}
                game={game}
                homeFlag={getTeamFlag(teamsById, game.home_team_id)}
                awayFlag={getTeamFlag(teamsById, game.away_team_id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-8 text-sm text-gray-500">
            No finished games yet. Upcoming fixtures are ready in the fixtures view.
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
