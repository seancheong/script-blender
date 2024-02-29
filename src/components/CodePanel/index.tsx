'use client';

import { useMobileLayout } from '@/hooks/useMobileLayout';
import { buildCode } from '@/services/codeService';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import { Preview } from './Preview';
import { SkeletonPanel } from './SkeletonPanel';

const ELEMENT_ID = 'code-panel';
const INITIAL_VALUE =
  '// Write your code here\n// then press Ctrl+S/Cmd+S to execute it';

const DynamicEditor = dynamic(
  () =>
    import('@/components/CodePanel/CodeEditor').then(
      (module) => module.default,
    ),
  {
    ssr: false,
    loading: () => (
      <SkeletonPanel className="rounded-t-[20px] rounded-b-none @md:rounded-r-none @md:rounded-l-[20px]" />
    ),
  },
);

export const CodePanel = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [_document, setDocument] = useState<Document | null>(null);

  const targetElement = _document?.getElementById(ELEMENT_ID);
  const isMobileLayout = useMobileLayout(targetElement || null);

  const handleCodeExecution = useCallback(
    async (newCode?: string) => {
      const { output, error } = await buildCode(newCode ?? code);

      setOutput(output);
      setError(error);
    },
    [code],
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
    <div id={ELEMENT_ID} className="@container h-full">
      {loading ? (
        <SkeletonPanel />
      ) : (
        <ResizablePanelGroup
          direction={isMobileLayout ? 'vertical' : 'horizontal'}
        >
          <ResizablePanel>
            <DynamicEditor
              initialValue={INITIAL_VALUE}
              onChange={setCode}
              onExecute={handleCodeExecution}
              onError={setError}
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
