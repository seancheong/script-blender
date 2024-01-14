import Image from 'next/image';

export const Header = () => {
  return (
    <header className='flex gap-2 h-12 px-4 py-2'>
      <Image
        src='./logo.svg'
        width={42}
        height={42}
        alt='script-blender-logo'
      />

      <h1 className='text-2xl font-semibold text-zinc-50'>Script Blender</h1>
    </header>
  );
};
