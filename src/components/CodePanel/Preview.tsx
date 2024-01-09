'use client';

import { useEffect, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

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
    <div className='relative h-full bg-zinc-800 p-4 border-2 border-neutral-400 rounded-b-lg @md:rounded-bl-none @md:rounded-r-lg'>
      <Select>
        <SelectTrigger className='w-28 mb-4 h-8'>
          <SelectValue placeholder='Console' />
        </SelectTrigger>

        <SelectContent className='h-8'>
          <SelectItem value='console' className='py-0'>
            Console
          </SelectItem>
        </SelectContent>
      </Select>

      <iframe
        title='preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
        className='w-full h-full bg-zinc-800'
      />
      {error && (
        <div className='absolute top-2 left-2 text-red-500'>{error}</div>
      )}
    </div>
  );
};
