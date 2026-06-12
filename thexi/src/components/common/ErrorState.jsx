function ErrorState({ title = 'Something went wrong', message, action }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-sm text-red-100">
      <h2 className="font-bold text-red-200">{title}</h2>
      <p className="mt-2 text-red-100/75">{message || 'Please try again in a moment.'}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default ErrorState;
