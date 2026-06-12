function FavoriteButton({ active, onClick, label, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
        active
          ? 'border-amber-400/40 bg-amber-400/15 text-amber-300'
          : 'border-gray-800 bg-gray-900/70 text-gray-500 hover:border-purple-500/40 hover:text-white'
      } ${className}`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {active ? '*' : '+'}
      </span>
    </button>
  );
}

export default FavoriteButton;
