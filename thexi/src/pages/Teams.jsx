import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import FavoriteButton from '../components/common/FavoriteButton';
import { TeamCardSkeleton } from '../components/common/Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import { useTeams } from '../hooks/useTeams';
import { getTeamName } from '../utils/tournament';

function Teams() {
  const [selectedGroup, setSelectedGroup] = useState('All');
  const { data: teams = [], isLoading, error } = useTeams();
  const { isTeamFavorite, toggleFavoriteTeam } = useFavorites();

  const groups = useMemo(() => ['All', ...new Set(teams.map((team) => team.groups).filter(Boolean))].sort(), [teams]);
  const filteredTeams = selectedGroup === 'All' ? teams : teams.filter((team) => team.groups === selectedGroup);

  if (error) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <ErrorState title="Teams unavailable" message={error.message} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Participating Teams
        </h1>
        <p className="mt-1 text-sm text-gray-400">Explore all national squads competing in the tournament.</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-800 pb-5">
        {groups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setSelectedGroup(group)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              selectedGroup === group
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'border border-gray-800/80 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {group === 'All' ? 'All Groups' : `Group ${group}`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => <TeamCardSkeleton key={index} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredTeams.map((team) => {
            const favorite = isTeamFavorite(team.id);
            return (
              <article
                key={team.id}
                className="group relative flex flex-col items-center justify-between rounded-xl border border-gray-800 bg-[#111827] p-4 shadow-md transition-all duration-300 hover:border-purple-500/50 hover:scale-[1.02]"
              >
                <FavoriteButton
                  active={favorite}
                  onClick={() => toggleFavoriteTeam(team.id)}
                  label={favorite ? 'Remove team from favorites' : 'Add team to favorites'}
                  className="absolute right-3 top-3 h-7 w-7"
                />
                <Link to={`/team/${team.id}`} className="flex w-full flex-col items-center">
                  <div className="mb-4 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-inner">
                    <img
                      src={team.flag}
                      alt={getTeamName(team)}
                      className="max-h-12 max-w-full rounded object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="truncate text-sm font-bold text-gray-200 group-hover:text-white">{getTeamName(team)}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">FIFA: {team.fifa_code || 'TBA'}</p>
                  </div>
                  <div className="mt-3 flex w-full items-center justify-center border-t border-gray-800 pt-2">
                    <span className="rounded border border-purple-500/10 bg-purple-950/45 px-2 py-0.5 text-[9px] font-bold text-purple-400">
                      Group {team.groups || '-'}
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Teams;
