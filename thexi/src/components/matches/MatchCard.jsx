import { Link } from 'react-router-dom';
import CountdownTimer from '../common/CountdownTimer';
import FavoriteButton from '../common/FavoriteButton';
import { useFavorites } from '../../hooks/useFavorites';
import {
  formatMatchDate,
  getMatchTeamName,
  isFinishedMatch,
  isLiveMatch,
  parseScorers,
} from '../../utils/tournament';

function MatchCard({ game, homeFlag, awayFlag }) {
  const { isMatchFavorite, toggleFavoriteMatch } = useFavorites();
  const isFinished = isFinishedMatch(game);
  const isLive = isLiveMatch(game);
  const favorite = isMatchFavorite(game.id);
  const homeScorers = parseScorers(game.home_scorers);
  const awayScorers = parseScorers(game.away_scorers);

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-gray-800 bg-[#111827] p-4 shadow-md transition-all duration-300 hover:border-purple-500/50">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-gray-800/60 pb-2 text-xs text-gray-500">
        <Link to={`/match/${game.id}`} className="font-semibold text-purple-400 hover:text-purple-300">
          {game.group ? `Group ${game.group}` : game.type || 'Match'}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-right">{formatMatchDate(game)}</span>
          <FavoriteButton
            active={favorite}
            onClick={() => toggleFavoriteMatch(game.id)}
            label={favorite ? 'Remove match from favorites' : 'Add match to favorites'}
            className="h-7 w-7"
          />
        </div>
      </div>

      <Link to={`/match/${game.id}`} className="grid grid-cols-7 items-center gap-2 py-2">
        <div className="col-span-3 flex flex-col items-center gap-2 text-center">
          {homeFlag ? (
            <img
              src={homeFlag}
              alt={getMatchTeamName(game, 'home')}
              className="h-8 w-12 rounded border border-gray-800 object-contain shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-800 text-[10px] text-gray-500">
              TBD
            </div>
          )}
          <span className="text-sm font-bold tracking-wide text-gray-200 transition-colors group-hover:text-white">
            {getMatchTeamName(game, 'home')}
          </span>
        </div>

        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="flex gap-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-1 text-xl font-extrabold tracking-wider text-white">
            <span>{game.home_score ?? 0}</span>
            <span className="text-gray-600">-</span>
            <span>{game.away_score ?? 0}</span>
          </div>

          <div className="mt-2">
            {isFinished ? (
              <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                FT
              </span>
            ) : isLive ? (
              <span className="rounded-full border border-red-500/30 bg-red-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                Live
              </span>
            ) : (
              <span className="rounded-full border border-purple-500/20 bg-purple-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                VS
              </span>
            )}
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center gap-2 text-center">
          {awayFlag ? (
            <img
              src={awayFlag}
              alt={getMatchTeamName(game, 'away')}
              className="h-8 w-12 rounded border border-gray-800 object-contain shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-800 text-[10px] text-gray-500">
              TBD
            </div>
          )}
          <span className="text-sm font-bold tracking-wide text-gray-200 transition-colors group-hover:text-white">
            {getMatchTeamName(game, 'away')}
          </span>
        </div>
      </Link>

      {!isFinished && !isLive ? (
        <div className="mt-3 flex items-center justify-center border-t border-gray-800/40 pt-3">
          <CountdownTimer targetDateStr={game.local_date} />
        </div>
      ) : null}

      {(homeScorers.length > 0 || awayScorers.length > 0) && (
        <div className="mt-3 grid grid-cols-2 gap-4 border-t border-gray-800/40 pt-2 text-[10px] font-medium leading-relaxed text-gray-400">
          <div className="border-r border-gray-800/40 pr-2 text-right">
            {homeScorers.map((scorer) => (
              <div key={scorer}>{scorer}</div>
            ))}
          </div>
          <div className="pl-2 text-left">
            {awayScorers.map((scorer) => (
              <div key={scorer}>{scorer}</div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default MatchCard;
