// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';

import { Var, App, Abs, Sas, Ast } from '../ast';
import { Choose } from './Choose'; // eslint-disable-line no-unused-vars
import { Menu } from './Menu'; // eslint-disable-line no-unused-vars
import { Observable } from '../utils';
import { e as evaluate } from '../core/evaluate';
import { inf as infere } from '../core/infere';
import { styles } from './styles';
import { loadSnippets, load, importFile, exportFile } from './storage';

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
    } catch (e) { inferedString = e.ast.toString(); }
    return <div className={styles.result}>
      <div className={styles.result}>
        {res.lambda.render()}
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
    return e.message;
  }
}

type EditorState = {
  insert: ?(a: Ast) => void;
  ast: Ast;
};

export class Editor extends React.Component<void, {}, EditorState> {
  state: EditorState;
  render() {
    return <div className={styles.root}>
      <Menu actions={this}/>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.source} onKeyUp={this.stopTab} onKeyDown={this.stopTab}>
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
  componentWillMount() {
    selected.subscribe(this.choose);
    this.selectRoot();
  }
  componentWillUnmount() {
    selected.unsubscribe(this.choose);
  }
}
