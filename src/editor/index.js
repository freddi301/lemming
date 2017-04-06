// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';

import { Var, App, Abs, Sas, Ast } from '../ast';
import { Choose } from './Choose'; // eslint-disable-line no-unused-vars
import { Observable } from '../utils';
import { e as evaluate } from '../core/evaluate';
import { styles } from './styles';

function load() {
  const got = localStorage.getItem('demo');
  if (!got) return null;
  return Ast.fromJSON(JSON.parse(got));
}

function loadSnippets() {
  const got = localStorage.getItem('snippets');
  if (!got) return null;
  return JSON.parse(got).map(Ast.fromJSON);
}

function exportFile(filename, type, data) {
  const blob = new Blob([data], { type });
  const elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  elem.click();
}

function importFile(): Promise<Ast> {
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

let demo = load() || new Sas({
  left: new Var({ name: 'main' }),
  right: new Abs({
    head: new Var({ name: 'x' }),
    body: new Var({ name: 'x' })
  }),
  body: new Var({ name: 'main' })
});

const snippets = loadSnippets() || [];

export const selected: Observable<{
  insert: (a: Ast) => void,
  ast: Ast
}> = new Observable;

function safeEvaluate(ast) {
  try {
    const res = evaluate(ast.toLambda());
    return <div className={styles.result}>
      <div className={styles.result}>
        {res.lambda.render()}
      </div>
      <div className={`${styles.result} ${styles.column}`}>
        {res.scope.pairs().map(({ key, value }) =>
          <div key={key.name}>
            {key.name} = {value.render()}
          </div>
        )}
      </div>
    </div>;
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    if (e.ast) console.dir(e.ast); // eslint-disable-line no-console
    return e.message;
  }
}

type EditorState = {
  insert: ?(a: Ast) => void;
  ast: Ast;
};

export class Editor extends React.Component<void, {}, EditorState> {
  state: EditorState = { ast: demo, insert: null };
  render() {
    return <div className={styles.root}>
      <div className={styles.menu}>
        <button onClick={this.save}>save</button>
        <button onClick={this.export}>export</button>
        <button onClick={this.import}>import</button>
      </div>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.source}>
            {demo.render()}
          </div>
          {safeEvaluate(demo)}
        </div>
        <div>
          <div>{this.state.ast.render()}</div>
          <button onClick={this.saveSnippet}>save snippet</button>
          <Choose
            choose={this.state.insert}
            choises={[
              { name: 'Var', newNode: () => new Var({ name: 'x' }) },
              { name: 'App', newNode: () => new App({ left: new Var({ name: 'x' }), right: new Var({ name: 'x' }) }) },
              { name: 'Abs', newNode: () => new Abs({ head: new Var({ name: 'x' }), body: new Var({ name: 'x' }) }) },
              { name: 'Sas', newNode: () => new Sas({ left: new Var({ name: 'x' }), right: new Var({ name: 'x' }), body: new Var({ name: 'x' }) }) }
            ]}
          />
          <div>
            {snippets.map(snippet =>
              <div key={String(snippet)} onClick={this.insertSnippet(snippet)}>
                {snippet.render()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>;
  }
  choose = ({ insert, ast }: { ast: Ast, insert: (a: Ast) => void }) => {
    this.setState({ ast, insert });
  };
  save = () => {
    localStorage.setItem('demo', JSON.stringify(demo));
  }
  saveSnippet = () => {
    snippets.unshift(_.cloneDeep(this.state.ast));
    localStorage.setItem('snippets', JSON.stringify(snippets));
    this.forceUpdate();
  }
  insertSnippet: (a: Ast) => () => void = snippet => () => {
    if (!this.state.insert) return;
    this.state.insert(snippet);
    this.forceUpdate();
  }
  export = () => {
    exportFile('program.lemming', 'application/json', JSON.stringify(demo));
  }
  import = async () => {
    demo = await importFile();
    this.forceUpdate();
  }
  componentWillMount() {
    selected.subscribe(this.choose);
  }
  componentWillUnmount() {
    selected.unsubscribe(this.choose);
  }
}
