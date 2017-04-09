// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast } from './Ast';
import { Var } from './Var';
import { App as AppComp } from '../components/App';  // eslint-disable-line no-unused-vars

export class App extends Ast {
  left: Ast;
  right: Ast;
  constructor({ left, right }: { left: Ast, right: Ast }) {
    super();
    this.left = left;
    this.right = right;
  }
  toLambda() {
    return new App({ left: this.left.toLambda(), right: this.right.toLambda() });
  }
  static defaultNewNode = () => new App({ left: new Var({ name: 'x' }), right: new Var({ name: 'x' }) });
  render(extra: ?{ noParens?: boolean }) {
    return <AppComp ast={this} extra={extra}/>;
  }
  toJSON() {
    return { type: 'App', left: this.left.toJSON(), right: this.right.toJSON() };
  }
  toString() {
    return `(${String(this.left)} ${String(this.right)})`;
  }
}

Ast.jsonParsers.App = o => {
  return new App({ left: Ast.fromJSON(o.left), right: Ast.fromJSON(o.right) });
};
