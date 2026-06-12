import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import GlobalSearch from './GlobalSearch';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
    }`;

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/fixtures" className={linkClass} onClick={() => setMenuOpen(false)}>
        Fixtures
      </NavLink>
      <NavLink to="/teams" className={linkClass} onClick={() => setMenuOpen(false)}>
        Teams
      </NavLink>
      <NavLink to="/standings" className={linkClass} onClick={() => setMenuOpen(false)}>
        Standings
      </NavLink>
      <NavLink to="/bracket" className={linkClass} onClick={() => setMenuOpen(false)}>
        Bracket
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                XI
              </span>
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                TheXI
              </span>
            </NavLink>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <GlobalSearch />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Live updates
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-gray-300 lg:hidden"
          >
            <span className="sr-only">Toggle navigation</span>
            <span aria-hidden="true" className="text-lg leading-none">
              {menuOpen ? 'x' : '='}
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div id="mobile-navigation" className="border-t border-gray-800 py-4 lg:hidden">
            <div className="mb-3 md:hidden">
              <GlobalSearch onNavigate={() => setMenuOpen(false)} />
            </div>
            <nav className="grid gap-2">{navLinks}</nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
