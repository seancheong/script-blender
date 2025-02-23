'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

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
  const [initialized, setInitialized] = useState(false);

  // The iframe needs a brief moment where it's hidden to properly initialize its internal state
  // Without this initialization period, the console.log override doesn't work on first render
  // This is likely due to a race condition in how iframes establish the JavaScript context
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="relative h-full bg-zinc-800 p-4 border-2 border-neutral-400 rounded-b-[20px] @md:rounded-l-none @md:rounded-r-[20px]">
      <h4 className="text-zinc-50 mb-3">Console</h4>

      <Separator />

      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        className={clsx(
          'w-full h-[93%] bg-zinc-800 mt-1',
          (!initialized || error) && 'hidden',
        )}
      />

      {!initialized && (
        <div className="absolute top-16 left-4 text-neutral-400">
          Initializing console preview...
        </div>
      )}

      {error && (
        <div className="absolute top-16 left-4 text-red-500">{error}</div>
      )}
    </div>
  );
};
