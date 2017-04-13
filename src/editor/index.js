// @flow

import React from 'react';
import _ from 'lodash';

import { Var, Abs, Sas, Ast, Infix, App } from '../ast';
import { Choose } from './Choose';
import { Menu } from './Menu';
import { Observable } from '../utils';
import { e as evaluate } from '../core/evaluate';
import type { Scope } from '../core/evaluate';
import { inf as infere } from '../core/infere';
import { styles } from './styles';
import { loadSnippets, load, importFile, exportFile } from './storage';
import { Button } from '../components/Button';
import { Ast as AstComp } from '../components/Ast';

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
  let inferedString = '';
  let resultScope;
  let resultAst;
  const lambda = ast.toLambda();
  try {
    const res = evaluate(lambda);
    resultScope = res.scope;
    resultAst = res.ast;
  } catch (e) { void 0; }
  try {
    const infered = infere(lambda);
    inferedString += infered.type;
    inferedString += '\n';
    inferedString = infered.constraints.stringifyType(infered.type);
    inferedString += '\n';
    inferedString += infered.constraints.toString();
  } catch (e) { inferedString = 'inference error'; }
  return { ast: resultAst, scope: resultScope, typeScope: inferedString };
}

type EditorState = {
  insert: ?(a: Ast) => void;
  ast: Ast;
  result: { ast: ?Ast, scope: ?Scope, typeScope: ?string }
};

export class Editor extends React.Component {
  state: EditorState;
  render() {
    return <div className={styles.root} onKeyUp={this.shortCuts} onKeyDown={this.shortCuts}>
      <Menu actions={this}/>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.source} onKeyUp={this.stopTab} onKeyDown={this.stopTab}>
            <AstComp ast={demo}/>
          </div>
          { this.state.result ? <div style={{ flexGrow: 1, flexBasis: 1, display: 'flex', flexDirection: 'row' }}>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0px 5px' }}>Result<div className={styles.hr}></div></div>
              <div style={{ padding: '0px 5px', overflow: 'auto', flexGrow: 1 }}>
                {this.state.result.ast ? <AstComp ast={this.state.result.ast}/> : null}
              </div>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0px 5px' }}>Types<div className={styles.hr}></div></div>
              <div style={{ padding: '0px 5px', overflow: 'auto', flexGrow: 1, whiteSpace: 'pre' }}>
                {this.state.result.typeScope}
              </div>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0px 5px' }}>Scope<div className={styles.hr}></div></div>
              <div style={{ padding: '0px 5px', overflow: 'auto', flexGrow: 1 }}>
                {this.state.result.scope ? this.state.result.scope.pairs().map(({ key, value }) =>
                <div key={key.name} style={{ display: 'flex', flexDirection: 'row' }}>
                  <span>{key.name} = </span><AstComp ast={value}/>
                </div>
              ) : null}
              </div>
            </div>
          </div> : null}
        </div>
        <div className={styles.right}>
          <div style={{ overflow: 'auto', flexGrow: 2, flexBasis: 2 }}><AstComp ast={this.state.ast}/></div>
          <div style={{ overflow: 'auto', flexGrow: 1, flexBasis: 1 }}>
            <Choose choose={this.state.insert} choises={choises}/>
            <Button onClick={this.saveSnippet}>save snippet</Button>
          </div>
          <div style={{ overflow: 'auto', flexGrow: 2, flexBasis: 2 }}>
            {snippets.map(snippet =>
              <div key={String(snippet)} onClick={this.insertSnippet(snippet)}>
                <AstComp ast={snippet}/>
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
    this.run();
    this.forceUpdate();
  }
  stopTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  result: React$Element<*>;
  run = () => this.setState({ result: safeEvaluate(demo) });
  shortCuts = (e: KeyboardEvent) => {
    if (this.state.insert && e.ctrlKey) {
      const shortcut = Object.keys(choises).map(k => choises[k]).find(ch => ch.shortcut === e.key);
      if (shortcut) {
        e.stopPropagation();
        e.preventDefault(); // $ExpectError
        if (e.type === 'keyup') this.state.insert(shortcut.new());
      }
    }
  }
  componentWillMount() {
    selected.subscribe(this.choose);
    this.selectRoot();
    this.run();
  }
  componentWillUnmount() {
    selected.unsubscribe(this.choose);
  }
}

const choises = {
  Var: { new: Var.defaultNewNode, shortcut: 'u' },
  App: { new: App.defaultNewNode, shortcut: 'p' },
  Abs: { new: Abs.defaultNewNode, shortcut: 'l' },
  Sas: { new: Sas.defaultNewNode, shortcut: 's' },
  Infix: { new: Infix.defaultNewNode, shortcut: 'i' }
};
