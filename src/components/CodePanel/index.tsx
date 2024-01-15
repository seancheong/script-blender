'use client';

import { useMobileLayout } from '@/hooks/useMobileLayout';
import { buildCode } from '@/services/codeService';
import { useCallback, useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../ui/resizable';
import { CodeEditor } from './Editor';
import { Preview } from './Preview';
import { SkeletonPanel } from './SkeletonPanel';

const elementId = 'code-panel';
const initialValue =
  '// Write your code here\n// then press Ctrl+S/Cmd+S to execute it';

export const CodePanel = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [_document, setDocument] = useState<Document | null>(null);

  const targetElement = _document?.getElementById(elementId);
  const isMobileLayout = useMobileLayout(targetElement || null);

  const handleCodeExecution = useCallback(
    async (newCode?: string) => {
      buildCode(newCode ?? code).then(({ output, error }) => {
        setOutput(output);

        setError(error);
      });
    },
    [code]
  );

  useEffect(() => {
    setDocument(document);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const actionTimer = 5000;

    const actionTimeout = setTimeout(() => {
      handleCodeExecution();
    }, actionTimer);

    return () => {
      clearTimeout(actionTimeout);
    };
  }, [code, handleCodeExecution]);

  return (
    <div id={elementId} className='@container h-full'>
      {loading ? (
        <SkeletonPanel />
      ) : (
        <ResizablePanelGroup
          direction={isMobileLayout ? 'vertical' : 'horizontal'}
        >
          <ResizablePanel>
            <CodeEditor
              initialValue={initialValue}
              onChange={setCode}
              onExecute={handleCodeExecution}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            <Preview code={output} error={error} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};
