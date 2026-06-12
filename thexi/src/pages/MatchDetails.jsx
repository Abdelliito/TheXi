import { Link, useParams } from 'react-router-dom';
import CountdownTimer from '../components/common/CountdownTimer';
import ErrorState from '../components/common/ErrorState';
import FavoriteButton from '../components/common/FavoriteButton';
import { Skeleton } from '../components/common/Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import {
  formatMatchDate,
  getMatchTeamName,
  getTeamName,
  getTeamFlag,
  isFinishedMatch,
  isLiveMatch,
  makeTeamsById,
  normalizeId,
  parseScorers,
} from '../utils/tournament';

function MatchDetails() {
  const { id } = useParams();
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();
  const { isMatchFavorite, toggleFavoriteMatch } = useFavorites();

  if (gamesLoading || teamsLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </main>
    );
  }

  if (gamesError || teamsError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ErrorState message={gamesError?.message || teamsError?.message} />
      </main>
    );
  }

  const game = games.find((item) => normalizeId(item.id) === normalizeId(id));
  if (!game) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ErrorState title="Match not found" message="That fixture is not available in the tournament feed." />
      </main>
    );
  }

  const teamsById = makeTeamsById(teams);
  const homeTeam = teamsById[normalizeId(game.home_team_id)];
  const awayTeam = teamsById[normalizeId(game.away_team_id)];
  const homeScorers = parseScorers(game.home_scorers);
  const awayScorers = parseScorers(game.away_scorers);
  const finished = isFinishedMatch(game);
  const live = isLiveMatch(game);
  const favorite = isMatchFavorite(game.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/fixtures" className="text-sm font-semibold text-purple-400 hover:text-purple-300">
          Back to fixtures
        </Link>
        <FavoriteButton
          active={favorite}
          onClick={() => toggleFavoriteMatch(game.id)}
          label={favorite ? 'Remove match from favorites' : 'Add match to favorites'}
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-800 bg-[#111827] shadow-2xl">
        <div className="border-b border-gray-800 bg-gray-950/40 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span>{game.group ? `Group ${game.group}` : game.type || 'Match'}</span>
            <span>{formatMatchDate(game)}</span>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {[
            { team: homeTeam, name: getMatchTeamName(game, 'home'), score: game.home_score, flag: getTeamFlag(teamsById, game.home_team_id), to: game.home_team_id },
            { team: awayTeam, name: getMatchTeamName(game, 'away'), score: game.away_score, flag: getTeamFlag(teamsById, game.away_team_id), to: game.away_team_id },
          ].map((entry, index) => (
            <Link
              key={`${entry.name}-${index}`}
              to={entry.team ? `/team/${entry.to}` : '#'}
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/30 p-5 text-center transition hover:border-purple-500/40"
            >
              {entry.flag ? (
                <img src={entry.flag} alt={entry.name} className="h-16 w-24 rounded border border-gray-800 object-contain" />
              ) : (
                <div className="flex h-16 w-24 items-center justify-center rounded border border-gray-800 bg-gray-900 text-xs text-gray-500">
                  TBD
                </div>
              )}
              <div>
                <h1 className="text-xl font-extrabold text-white">{entry.name}</h1>
                <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                  {entry.team ? `${entry.team.fifa_code || ''} Group ${entry.team.groups || '-'}` : 'To be decided'}
                </p>
              </div>
              <div className="text-5xl font-black text-white">{entry.score ?? 0}</div>
            </Link>
          ))}

          <div className="order-first flex flex-col items-center md:order-none">
            <div className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-bold uppercase tracking-widest text-gray-400">
              {finished ? 'Full time' : live ? 'Live' : 'Kickoff'}
            </div>
            {!finished && !live ? <div className="mt-4"><CountdownTimer targetDateStr={game.local_date} /></div> : null}
          </div>
        </div>

        <div className="grid gap-4 border-t border-gray-800 px-5 py-5 sm:grid-cols-3">
          <Info label="Venue" value={game.stadium || game.venue || 'TBA'} />
          <Info label="Stage" value={game.type || 'Group'} />
          <Info label="Status" value={finished ? 'Finished' : live ? 'In play' : 'Upcoming'} />
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <Scorers title={getTeamName(homeTeam) || getMatchTeamName(game, 'home')} scorers={homeScorers} />
        <Scorers title={getTeamName(awayTeam) || getMatchTeamName(game, 'away')} scorers={awayScorers} />
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="mt-2 font-bold text-gray-100">{value}</p>
    </div>
  );
}

function Scorers({ title, scorers }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
      <h2 className="font-bold text-white">{title} scorers</h2>
      {scorers.length ? (
        <div className="mt-4 space-y-2 text-sm text-gray-300">
          {scorers.map((scorer) => <p key={scorer}>{scorer}</p>)}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No scorers recorded.</p>
      )}
    </div>
  );
}

export default MatchDetails;
