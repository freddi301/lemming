// @flow

import { Ast } from '../ast';

export function load() {
  const got = localStorage.getItem('demo');
  if (!got) return null;
  return Ast.fromJSON(JSON.parse(got));
}

export function loadSnippets() {
  const got = localStorage.getItem('snippets');
  if (!got) return null;
  return JSON.parse(got).map(Ast.fromJSON);
}

export type FileTypes = 'application/json';

export function exportFile(filename: string, type: FileTypes, data: string) {
  const blob = new Blob([data], { type });
  const elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  elem.click();
}

export function importFile(): Promise<Ast> {
  return new Promise(resolve => {
    const elem = window.document.createElement('input');
    elem.type = 'file';
    elem.addEventListener('change', e => {
      const reader = new FileReader();
      reader.onload = e => resolve(Ast.fromJSON(JSON.parse(e.target.result)));
      reader.readAsText(e.target.files[0]);
    });
    elem.click();
  });
}
