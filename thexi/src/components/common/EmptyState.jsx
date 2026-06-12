function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] px-6 py-14 text-center shadow-lg">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
