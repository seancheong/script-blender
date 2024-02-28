import { twMerge } from 'tailwind-merge';

import { Skeleton } from '../ui/skeleton';

interface Props {
  className?: string;
}

export const SkeletonPanel = ({ className = '' }: Props) => (
  <div
    data-testid="skeleton-panel"
    className={twMerge(
      'w-full h-full bg-zinc-800 flex flex-col gap-4 justify-center items-center rounded-[20px] border-2 border-neutral-400',
      className,
    )}
  >
    <div className="w-3/4 flex gap-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>

    <div className="w-3/4 flex gap-2">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>

    <div className="w-3/4 flex gap-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/12" />
      <Skeleton className="h-4 w-1/12" />
    </div>
  </div>
);
