// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';

import { Var, App, Abs, Ast } from '../ast';
import { Choose } from '../containers/Choose'; // eslint-disable-line no-unused-vars
import { Observable } from '../utils';
import { e as evaluate } from '../core/evaluate';
import { styles } from '../components/styles';

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

const demo = load() || new App({
  left: new Var({ name: 'x' }),
  right: new Var({ name: 'x' })
});

const snippets = loadSnippets() || [];

export const selected: Observable<{
  insert: (a: Ast) => void,
  ast: Ast
}> = new Observable;

function safeEvaluate(ast) {
  try {
    const res = evaluate(ast);
    return <div>
      {res.lambda.render()}
      <div>
        {res.scope.pairs().map(({ key, value }) =>
          <div key={key.name}>
            {key.name} = {value.render()}
          </div>
        )}
      </div>
    </div>;
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
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
    return <div>
      <div>
        <button onClick={this.save}>save</button>
      </div>
      {demo.render()}<br/>
      {safeEvaluate(demo)}
      {}
      <div style={{
        position: 'fixed', top: '0px', right: '0px',
        width: '400px', height: '100%', backgroundColor: '#d3d3d3'
      }}>
        <div>{this.state.ast.render()}</div>
        <button onClick={this.saveSnippet}>save snippet</button>
        <Choose
          choose={this.state.insert}
          choises={[
            { name: 'Var', newNode: () => new Var({ name: 'x' }) },
            { name: 'App', newNode: () => new App({ left: new Var({ name: 'x' }), right: new Var({ name: 'x' }) }) },
            { name: 'Abs', newNode: () => new Abs({ head: new Var({ name: 'x' }), body: new Var({ name: 'x' }) }) }
          ]}
        />
        <div>
          {snippets.map(snippet =>
            <div className={styles.container} key={String(snippet)} onClick={this.insertSnippet(snippet)}>
              {snippet.render()}
            </div>
          )}
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
    this.state.insert(snippet);
    this.forceUpdate();
  }
  componentWillMount() {
    selected.add(this.choose);
  }
  componentWillUnmount() {
    selected.delete(this.choose);
  }
}
