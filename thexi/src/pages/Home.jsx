import { Link } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import { MatchCardSkeleton } from '../components/common/Skeleton';
import MatchCard from '../components/matches/MatchCard';
import { useFavorites } from '../hooks/useFavorites';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { getTeamFlag, getTeamName, isFinishedMatch, makeTeamsById, normalizeId } from '../utils/tournament';

function Home() {
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();
  const { favoriteMatches, favoriteTeams } = useFavorites();

  const finishedGames = games.filter(isFinishedMatch);
  const incomingGames = games.filter((game) => !isFinishedMatch(game));
  const teamsById = makeTeamsById(teams);

  const favMatchData = favoriteMatches
    .map((id) => games.find((g) => normalizeId(g.id) === normalizeId(id)))
    .filter(Boolean);

  const favTeamData = favoriteTeams
    .map((id) => teams.find((t) => normalizeId(t.id) === normalizeId(id)))
    .filter(Boolean);

  const hasFavorites = favMatchData.length > 0 || favTeamData.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-purple-500/10 bg-gradient-to-b from-purple-950/20 to-transparent px-4 py-16 text-center shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
          🎉 FIFA World Cup 2026 Edition
        </span>
        <h1 className="mb-6 bg-gradient-to-r from-white via-gray-100 to-purple-400 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl">
          The Future of Football Tracking
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Real-time scores, live group calculations, fixture schedules, favorites, and complete tournament context.
          All times shown in <span className="font-semibold text-purple-300">Pakistan Standard Time (PKT)</span>.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/fixtures"
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-500 hover:scale-[1.02]"
          >
            View Fixtures
          </Link>
          <Link
            to="/standings"
            className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white hover:scale-[1.02]"
          >
            Explore Standings
          </Link>
        </div>
      </section>

      {/* ── Error banner ── */}
      {gamesError || teamsError ? (
        <div className="mb-12">
          <ErrorState title="Tournament feed unavailable" message={gamesError?.message || teamsError?.message} />
        </div>
      ) : null}

      {/* ── Quick Stats ── */}
      <section className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { label: 'Participating Teams', value: teamsLoading ? '…' : teams.length || 48 },
          { label: 'Total Matches', value: gamesLoading ? '…' : games.length || 104 },
          { label: 'Completed', value: gamesLoading ? '…' : finishedGames.length },
          { label: 'Upcoming', value: gamesLoading ? '…' : incomingGames.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-800 bg-[#111827] p-6 shadow-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* ── Favorites ── */}
      {hasFavorites ? (
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">⭐ My Favorites</h2>
              <p className="mt-1 text-xs text-gray-500">Pinned matches and teams you're tracking.</p>
            </div>
          </div>

          {/* Favorite teams strip */}
          {favTeamData.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {favTeamData.map((team) => (
                <Link
                  key={team.id}
                  to={`/team/${team.id}`}
                  className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#111827] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-purple-500/50 hover:text-white"
                >
                  {team.flag && (
                    <img src={team.flag} alt={getTeamName(team)} className="h-5 w-7 rounded object-contain" />
                  )}
                  {getTeamName(team)}
                  <span className="text-xs text-gray-500">Gr. {team.groups}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Favorite matches grid */}
          {favMatchData.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favMatchData.map((game) => (
                <MatchCard
                  key={game.id}
                  game={game}
                  homeFlag={getTeamFlag(teamsById, game.home_team_id)}
                  awayFlag={getTeamFlag(teamsById, game.away_team_id)}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {/* ── Recent Results ── */}
      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Recent Results</h2>
            <p className="mt-1 text-xs text-gray-500">Latest completed matches.</p>
          </div>
          <Link to="/fixtures" className="text-xs font-bold text-purple-400 hover:text-purple-300">
            See all →
          </Link>
        </div>

        {gamesLoading || teamsLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
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
            No finished games yet — check the fixtures view for upcoming matches.
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
