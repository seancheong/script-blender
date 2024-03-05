import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { KeyCode, KeyMod, editor } from 'monaco-editor';
import Highlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import babel from 'prettier/plugins/babel';
import esTree from 'prettier/plugins/estree';
import { useRef, useState } from 'react';

import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import './jsx-highlighter.css';

interface Props {
  initialValue: string;
  onChange(value: string): void;
  onExecute(value: string): void;
  onError(errorMesssage: string): void;
}

const LANGUAGES = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
] as const;
type Language = (typeof LANGUAGES)[number]['value'];

const CodeEditor = ({ initialValue, onChange, onExecute, onError }: Props) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [language, setLanguage] = useState<Language>('javascript');

  const handleFormatClick = async () => {
    if (editorRef.current) {
      const unformatted = editorRef.current.getModel()?.getValue() || '';

      const formatted = await prettier.format(unformatted, {
        parser: 'babel',
        plugins: [babel, esTree],
        useTabs: false,
        semi: true,
        singleQuote: true,
      });

      editorRef.current.setValue(formatted.replace(/\n$/, ''));
    }
  };

  const handleEditorOnMount: OnMount = (editor) => {
    editorRef.current = editor;

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      parse,
      traverse,
      editor,
    );
    highlighter.highLightOnDidChangeModelContent();

    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
      onExecute(editor.getModel()?.getValue() || '');
    });
  };

  return (
    <div className="editor group relative h-full pt-4 bg-[#1e1e1e] border-2 border-neutral-400 rounded-t-[20px] @md:rounded-r-none @md:rounded-l-[20px]">
      <Button
        variant="secondary"
        className="absolute z-20 top-4 right-4 opacity-0 h-8 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handleFormatClick}
      >
        Format
      </Button>

      <Select
        value={language}
        onValueChange={(language: Language) => setLanguage(language)}
      >
        <SelectTrigger className="w-28 ml-4 mb-4 h-8 focus:ring-offset-0">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {LANGUAGES.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                {language.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <MonacoEditor
        value={initialValue}
        onMount={handleEditorOnMount}
        onChange={(value) => onChange(value || '')}
        onValidate={(markers) =>
          onError(markers.map((marker) => marker.message).join('\n'))
        }
        height={'90%'}
        theme="vs-dark"
        language={language}
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
