import { useState, useEffect } from 'react';
import { normalizeId } from '../utils/tournament';

const readStorage = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved).map(normalizeId) : [];
  } catch {
    return [];
  }
};

export function useFavorites() {
  const [favoriteMatches, setFavoriteMatches] = useState(() => readStorage('thexi_fav_matches'));
  const [favoriteTeams, setFavoriteTeams] = useState(() => readStorage('thexi_fav_teams'));

  useEffect(() => {
    localStorage.setItem('thexi_fav_matches', JSON.stringify(favoriteMatches));
  }, [favoriteMatches]);

  useEffect(() => {
    localStorage.setItem('thexi_fav_teams', JSON.stringify(favoriteTeams));
  }, [favoriteTeams]);

  const toggleFavoriteMatch = (id) => {
    const normalizedId = normalizeId(id);
    setFavoriteMatches((prev) =>
      prev.includes(normalizedId) ? prev.filter((item) => item !== normalizedId) : [...prev, normalizedId]
    );
  };

  const toggleFavoriteTeam = (id) => {
    const normalizedId = normalizeId(id);
    setFavoriteTeams((prev) =>
      prev.includes(normalizedId) ? prev.filter((item) => item !== normalizedId) : [...prev, normalizedId]
    );
  };

  const isMatchFavorite = (id) => favoriteMatches.includes(normalizeId(id));
  const isTeamFavorite = (id) => favoriteTeams.includes(normalizeId(id));

  return {
    favoriteMatches,
    favoriteTeams,
    toggleFavoriteMatch,
    toggleFavoriteTeam,
    isMatchFavorite,
    isTeamFavorite,
  };
}
