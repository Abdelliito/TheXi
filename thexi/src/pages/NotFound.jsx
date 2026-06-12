import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-purple-400">404</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-gray-400">
        The route you opened is not part of the tournament view. Head back to the live fixtures hub.
      </p>
      <Link
        to="/fixtures"
        className="mt-8 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-500"
      >
        View fixtures
      </Link>
    </main>
  );
}

export default NotFound;
