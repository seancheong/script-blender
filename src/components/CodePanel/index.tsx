'use client';

import { buildCode } from '@/services/codeService';
import { useCallback, useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../ui/resizable';
import { CodeEditor } from './Editor';
import { Preview } from './Preview';

export const CodePanel = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCodeExecution = useCallback(async () => {
    buildCode(code).then(({ output, error }) => {
      setOutput(output);

      setError(error);
    });
  }, [code]);

  useEffect(() => {
    const actionTimeout = setTimeout(() => {
      handleCodeExecution();
    }, 1000);

    return () => {
      clearTimeout(actionTimeout);
    };
  }, [code, handleCodeExecution]);

  return (
    <ResizablePanelGroup direction='horizontal' className='min-h-[500px]'>
      <ResizablePanel defaultSize={50}>
        <CodeEditor initialValue='const a = 1;' onChange={setCode} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <Preview code={output} error={error} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
