// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';

import { Var, Abs, Sas, Ast, Infix, App } from '../ast';
import { Choose } from './Choose'; // eslint-disable-line no-unused-vars
import { Menu } from './Menu'; // eslint-disable-line no-unused-vars
import { Observable } from '../utils';
import { e as evaluate } from '../core/evaluate';
import { inf as infere } from '../core/infere';
import { styles } from './styles';
import { loadSnippets, load, importFile, exportFile } from './storage';
import { Button } from './Button'; // eslint-disable-line no-unused-vars

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
    const lambda = ast.toLambda();
    const res = evaluate(lambda);
    let inferedString = '';
    try {
      const infered = infere(lambda);
      inferedString += infered.type;
      inferedString += '\n';
      inferedString = infered.constraints.stringifyType(infered.type);
      inferedString += '\n';
      inferedString += infered.constraints.toString();
    } catch (e) { inferedString = String(e.ast); }
    return <div className={styles.result}>
      <div className={styles.result}>
        {res.ast.render()}
      </div>
      <pre className={styles.result}>
        {inferedString}
      </pre>
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
    if (e.scope) console.dir(e.scope); // eslint-disable-line no-console
    return e.message;
  }
}

type EditorState = {
  insert: ?(a: Ast) => void;
  ast: Ast;
};

export class Editor extends React.Component {
  state: EditorState;
  render() {
    return <div className={styles.root}>
      <Menu actions={this}/>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.source} onKeyUp={this.stopTab} onKeyDown={this.stopTab}>
            {demo.render()}
          </div>
          <div className={styles.result}>
            {this.result}
          </div>
        </div>
        <div className={styles.right}>
          <div>{this.state.ast.render()}</div>
          |<Button onClick={this.saveSnippet}>save snippet</Button>|
          <Choose
            choose={this.state.insert}
            choises={choises}
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
    exportFile('program.lemming.json', 'application/json', JSON.stringify(demo, null, 2));
  }
  selectRoot = () => {
    selected.publish({
      ast: demo,
      insert: (a: Ast) => {
        demo = a;
        this.forceUpdate();
      }
    });
  }
  import = async () => {
    demo = await importFile();
    this.forceUpdate();
  }
  stopTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  result: React$Element<*>;
  run = () => {
    this.result = safeEvaluate(demo);
    this.forceUpdate();
  }
  shortCuts = (e: KeyboardEvent) => {
    if (this.state.insert && e.ctrlKey && e.shiftKey) {
      if (e.type === 'keyup') {
        const shortcut = Object.values(choises).find(ch => ch.shortcut === e.key);
        if (shortcut) {
          e.stopPropagation();
          e.preventDefault();
          this.state.insert(shortcut.new());
        }
      }
      if (e.type == 'keydown') {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  componentWillMount() {
    selected.subscribe(this.choose);
    this.selectRoot();
    document.body.addEventListener('keyup', this.shortCuts);
    document.body.addEventListener('keydown', this.shortCuts);
  }
  componentWillUnmount() {
    selected.unsubscribe(this.choose);
    document.body.removeEventListener('keyup', this.shortCuts);
    document.body.removeEventListener('keydown', this.shortCuts);
  }
}

const choises = {
  Var: { new: Var.defaultNewNode, shortcut: 'K' },
  App: { new: App.defaultNewNode, shortcut: 'A' },
  Abs: { new: Abs.defaultNewNode, shortcut: 'L' },
  Sas: { new: Sas.defaultNewNode, shortcut: '=' },
  Infix: { new: Infix.defaultNewNode, shortcut: ':' }
};
