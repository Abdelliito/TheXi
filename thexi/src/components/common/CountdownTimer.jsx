import { useState, useEffect } from 'react';

// Safely parse "MM/DD/YYYY HH:MM" into a JavaScript Date object
const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  try {
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) return null;
    const [month, day, year] = datePart.split('/').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
  } catch {
    return null;
  }
};

function CountdownTimer({ targetDateStr, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const kickoffDate = parseDateString(targetDateStr);
    if (!kickoffDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = kickoffDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    updateTimer(); // run once immediately
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase border border-purple-500/20">
        Kickoff
      </span>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (compact) {
    if (days > 0) return <span>{days}d {hours}h</span>;
    if (hours > 0) return <span>{hours}h {minutes}m</span>;
    return <span className="text-red-400 font-bold">{minutes}m {seconds}s</span>;
  }

  return (
    <div className="flex gap-1.5 items-center text-center">
      {days > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded px-1.5 py-0.5 min-w-[28px]">
          <div className="text-[10px] font-extrabold text-white leading-none">{days}</div>
          <div className="text-[7px] text-gray-500 uppercase font-semibold leading-none mt-0.5">d</div>
        </div>
      )}
      <div className="bg-gray-900 border border-gray-800 rounded px-1.5 py-0.5 min-w-[28px]">
        <div className="text-[10px] font-extrabold text-white leading-none">{hours}</div>
        <div className="text-[7px] text-gray-500 uppercase font-semibold leading-none mt-0.5">h</div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded px-1.5 py-0.5 min-w-[28px]">
        <div className="text-[10px] font-extrabold text-white leading-none">{minutes}</div>
        <div className="text-[7px] text-gray-500 uppercase font-semibold leading-none mt-0.5">m</div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded px-1.5 py-0.5 min-w-[28px]">
        <div className={`text-[10px] font-extrabold leading-none ${days === 0 && hours === 0 ? 'text-red-400' : 'text-white'}`}>{seconds}</div>
        <div className="text-[7px] text-gray-500 uppercase font-semibold leading-none mt-0.5">s</div>
      </div>
    </div>
  );
}

export default CountdownTimer;
