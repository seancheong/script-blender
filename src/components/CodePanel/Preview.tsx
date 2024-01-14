'use client';

import { useEffect, useRef } from 'react';
import { Separator } from '../ui/separator';

interface Props {
  code: string;
  error: string;
}

const html = `
  <html>
    <head></head>
    <body>
      <div id='root'></div>
      <script>
        const handleError = (error) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;">' + error + '</div>'

          console.error(error);
        };

        window.console.log = (...args) => {
          const formattedArgs = args.map((arg) => {
            if (typeof arg === 'object') {
              return JSON.stringify(arg);
            } else {
              return arg;
            }
          });

          const root = document.querySelector('#root');
          root.innerHTML += '<div style="color: white;">' + formattedArgs.join(' ') + '</div>';
        };

        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        });

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (error) {
            handleError(error);
          }
        }, false);
      </script>
    </body>
  </html>
`;

export const Preview = ({ code, error }: Props) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframe.current) {
      iframe.current.srcdoc = html;

      setTimeout(() => {
        if (iframe.current?.contentWindow && code) {
          iframe.current.contentWindow.postMessage(code, '*');
        }
      }, 50);
    }
  }, [code]);

  return (
    <div className='relative h-full bg-zinc-800 p-4 border-2 border-neutral-400 rounded-b-[20px] @md:rounded-l-none @md:rounded-r-[20px]'>
      <h4 className='text-white mb-3'>Console</h4>

      <Separator />

      <iframe
        title='preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
        className='w-full h-[93%] bg-zinc-800 mt-1'
      />
      {error && (
        <div className='absolute top-16 left-4 text-red-500'>{error}</div>
      )}
    </div>
  );
};
