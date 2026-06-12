import { useState, useEffect } from 'react';
import { getMatchDate } from '../../utils/tournament';

// getMatchDate already converts the venue local_date string to the correct
// UTC timestamp (treating it as UTC-4 / Eastern Daylight Time).
// new Date() returns the current UTC instant, so the diff is always accurate
// regardless of the user's browser timezone — the displayed label is PKT.

function CountdownTimer({ targetDateStr, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Build a dummy game object so we can reuse getMatchDate
    const kickoffDate = getMatchDate({ local_date: targetDateStr });
    if (!kickoffDate) return;

    const updateTimer = () => {
      const diff = kickoffDate.getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      setTimeLeft({
        expired: false,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <span className="rounded-full border border-purple-500/20 bg-purple-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
        Kickoff
      </span>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (compact) {
    if (days > 0) return <span className="text-gray-400">{days}d {hours}h</span>;
    if (hours > 0) return <span className="text-gray-400">{hours}h {minutes}m</span>;
    return <span className="font-bold text-red-400">{minutes}m {seconds}s</span>;
  }

  return (
    <div className="flex items-center gap-1.5 text-center">
      {days > 0 && (
        <Unit value={days} label="d" />
      )}
      <Unit value={hours} label="h" />
      <Unit value={minutes} label="m" />
      <Unit value={seconds} label="s" urgent={days === 0 && hours === 0} />
    </div>
  );
}

function Unit({ value, label, urgent = false }) {
  return (
    <div className="min-w-[28px] rounded border border-gray-800 bg-gray-900 px-1.5 py-0.5">
      <div className={`text-[10px] font-extrabold leading-none ${urgent ? 'text-red-400' : 'text-white'}`}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="mt-0.5 text-[7px] font-semibold uppercase leading-none text-gray-500">{label}</div>
    </div>
  );
}

export default CountdownTimer;
