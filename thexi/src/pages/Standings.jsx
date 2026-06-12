import { Link } from 'react-router-dom';
import ErrorState from '../components/common/ErrorState';
import { TableRowSkeleton } from '../components/common/Skeleton';
import { useGames } from '../hooks/useGames';
import { useTeams } from '../hooks/useTeams';
import { calculateStandings, groupStandings } from '../utils/tournament';

function Standings() {
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useGames();
  const { data: teams = [], isLoading: teamsLoading, error: teamsError } = useTeams();

  if (gamesError || teamsError) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <ErrorState title="Standings unavailable" message={gamesError?.message || teamsError?.message} />
      </main>
    );
  }

  const loading = gamesLoading || teamsLoading;
  const groupsMap = groupStandings(calculateStandings(teams, games));
  const sortedGroupKeys = loading ? ['A', 'B', 'C', 'D'] : Object.keys(groupsMap).sort();

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Group Standings
        </h1>
        <p className="mt-1 text-sm text-gray-400">Live calculations based on played match results.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {sortedGroupKeys.map((groupName) => (
          <section key={groupName} className="overflow-hidden rounded-xl border border-gray-800 bg-[#111827] p-5 shadow-lg">
            <h2 className="mb-4 border-b border-gray-800 pb-2 text-lg font-bold text-purple-400">Group {groupName}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 font-semibold uppercase text-gray-500">
                    <th className="py-2 pl-2">#</th>
                    <th className="py-2">Team</th>
                    <th className="py-2 text-center">P</th>
                    <th className="py-2 text-center">W</th>
                    <th className="py-2 text-center">D</th>
                    <th className="py-2 text-center">L</th>
                    <th className="py-2 text-center">GD</th>
                    <th className="py-2 text-center font-bold text-gray-300">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => <TableRowSkeleton key={index} />)
                    : groupsMap[groupName].map((team, index) => (
                      <tr key={team.id} className="text-gray-300 transition-colors hover:bg-gray-800/20">
                        <td className="w-6 py-3 pl-2 font-semibold text-gray-500">{index + 1}</td>
                        <td className="flex items-center gap-2 py-3 font-medium text-gray-200">
                          {team.flag ? (
                            <img src={team.flag} alt={team.name} className="h-4 w-6 rounded border border-gray-800 object-contain shadow-sm" />
                          ) : null}
                          <Link to={`/team/${team.id}`} className="truncate hover:text-purple-300">
                            {team.name}
                          </Link>
                        </td>
                        <td className="py-3 text-center">{team.played}</td>
                        <td className="py-3 text-center">{team.won}</td>
                        <td className="py-3 text-center">{team.drawn}</td>
                        <td className="py-3 text-center">{team.lost}</td>
                        <td className={`py-3 text-center font-medium ${team.gd > 0 ? 'text-emerald-400' : team.gd < 0 ? 'text-rose-400' : 'text-gray-400'}`}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td className="py-3 text-center text-sm font-extrabold text-purple-400">{team.pts}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Standings;
