'use client';

import { buildScript } from '@/actions/buildScript';
import { CodeEditor } from '@/components/CodeEditor';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

const initialState = {
  output: ''
};

export default function Home() {
  const [code, setCode] = useState('');
  const [state, action] = useFormState(buildScript, initialState);
  const iframe = useRef<HTMLIFrameElement>(null);

  const html = `
    <html>
      <head></head>
      <body>
        <div id='root'></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (error) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;">' + error + '</div>'

              console.error(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  const handleFormAction = async () => {
    const formData = new FormData();
    formData.append('code', code);

    if (iframe.current) {
      iframe.current.srcdoc = html;
    }

    action(formData);
  };

  useEffect(() => {
    if (iframe.current && iframe.current.contentWindow && state.output) {
      iframe.current.contentWindow.postMessage(state.output, '*');
    }
  }, [state.output]);

  return (
    <main>
      <form
        action={handleFormAction}
        className='flex flex-col justify-center p-8'
      >
        <CodeEditor initialValue='const b = 1;' onChange={setCode} />
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

        <iframe
          title='preview'
          ref={iframe}
          sandbox='allow-scripts'
          srcDoc={html}
        />
      </form>
    </main>
  );
}
