// General pulsing skeleton block
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-800/60 ${className}`}
      {...props}
    />
  );
}

// Preset: Match Card Skeleton loader
export function MatchCardSkeleton() {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
      {/* Top details */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
      
      {/* Grid structure */}
      <div className="grid grid-cols-7 items-center gap-2 py-2">
        <div className="col-span-3 flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-12 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        <div className="col-span-1 flex flex-col items-center gap-1">
          <Skeleton className="h-7 w-10 rounded" />
          <Skeleton className="h-3 w-6 rounded-full mt-1" />
        </div>
        
        <div className="col-span-3 flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-12 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

// Preset: Team Card Skeleton loader
export function TeamCardSkeleton() {
  return (
    <div className="bg-[#111827] border border-gray-850 rounded-xl p-4 flex flex-col items-center justify-between shadow-md">
      <Skeleton className="w-full aspect-video rounded-lg mb-4" />
      <div className="w-full flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="mt-4 w-full pt-2 border-t border-gray-850 flex justify-center">
        <Skeleton className="h-3 w-14 rounded" />
      </div>
    </div>
  );
}

// Preset: Standings Table Row Skeleton loader
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-800/40">
      <td className="py-3 pl-2"><Skeleton className="h-4 w-3" /></td>
      <td className="py-3 flex items-center gap-2"><Skeleton className="h-4 w-6 rounded" /><Skeleton className="h-4 w-24" /></td>
      <td className="py-3"><Skeleton className="h-4 w-4 mx-auto" /></td>
      <td className="py-3"><Skeleton className="h-4 w-4 mx-auto" /></td>
      <td className="py-3"><Skeleton className="h-4 w-4 mx-auto" /></td>
      <td className="py-3"><Skeleton className="h-4 w-4 mx-auto" /></td>
      <td className="py-3"><Skeleton className="h-4 w-4 mx-auto" /></td>
      <td className="py-3"><Skeleton className="h-4 w-4 mx-auto" /></td>
    </tr>
  );
}
