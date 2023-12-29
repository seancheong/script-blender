'use client';

import { useEffect, useRef } from 'react';

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
    <div className='relative'>
      <iframe
        title='preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
      />
      {error && (
        <div className='absolute top-2 left-2 text-red-500'>{error}</div>
      )}
    </div>
  );
};
