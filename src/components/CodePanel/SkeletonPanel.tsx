import { Skeleton } from '../ui/skeleton';

export const SkeletonPanel = () => (
  <div className='w-full h-full bg-zinc-800 flex flex-col gap-4 justify-center items-center rounded-lg'>
    <div className='w-3/4 flex gap-2'>
      <Skeleton className='h-4 w-1/3' />
      <Skeleton className='h-4 w-2/3' />
    </div>

    <div className='w-3/4 flex gap-2'>
      <Skeleton className='h-4 w-2/3' />
      <Skeleton className='h-4 w-1/3' />
    </div>

    <div className='w-3/4 flex gap-2'>
      <Skeleton className='h-4 w-1/3' />
      <Skeleton className='h-4 w-1/12' />
      <Skeleton className='h-4 w-1/12' />
    </div>
  </div>
);
