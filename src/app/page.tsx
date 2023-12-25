'use client';

import { buildScript } from '@/actions/buildScript';
import { useFormState } from 'react-dom';

const initialState = {
  output: ''
};

export default function Home() {
  const [state, action] = useFormState(buildScript, initialState);

  return (
    <main>
      <form action={action} className='flex flex-col justify-center p-8'>
        <textarea
          name='input'
          className='border-2 border-gray-300 rounded-md mb-4 h-32 p-4'
        ></textarea>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Submit
        </button>

        <pre>{state.output}</pre>
      </form>
    </main>
  );
}
