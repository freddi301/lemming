// @flow

import React from 'react'; // eslint-disable-line no-unused-vars

import { Var, App, Abs, Ast } from '../ast';
import { Choose } from '../containers/Choose'; // eslint-disable-line no-unused-vars
import { Observable } from '../utils';

const demo = new Abs({
  head: new Var({ name: 'x' }),
  body: new Abs({
    head: new Var({ name: 'y' }),
    body: new App({
      left: new Var({ name: 'x' }),
      right: new Var({ name: 'y' })
    })
  })
});

export const insert: Observable<(a: Ast) => void> = new Observable;

export class Editor extends React.Component {
  render() {
    return <div>
      {demo.render()}
      <div style={{
        position: 'fixed', top: '0px', right: '0px',
        width: '400px', height: '100%', backgroundColor: '#d3d3d3'
      }}>
        <Choose
          choose={this.insert}
          choises={[
            { name: 'Var', newNode: () => new Var({ name: 'x' }) },
            { name: 'App', newNode: () => new App({ left: new Var({ name: 'x' }), right: new Var({ name: 'x' }) }) },
            { name: 'Abs', newNode: () => new Abs({ head: new Var({ name: 'x' }), body: new Var({ name: 'x' }) }) }
          ]}
        />
      </div>
    </div>;
  }
  insert: (a: Ast) => void;
  choose = (insert: (a: Ast) => void) => {
    this.insert = insert;
    this.forceUpdate();
  };
  componentWillMount() {
    insert.add(this.choose);
  }
  componentWillUnmount() {
    insert.delete(this.choose);
  }
}
