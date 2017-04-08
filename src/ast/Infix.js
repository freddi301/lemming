// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast } from './Ast';
import { Var } from './Var';
import { App } from './App';
import { Infix as InfixComp } from '../components/Infix';  // eslint-disable-line no-unused-vars

export class Infix extends Ast {
  left: Ast;
  right: Ast;
  center: Var;
  constructor({ left, center, right }: { left: Ast, center: Var, right: Ast }) {
    super();
    this.left = left;
    this.right = right;
    this.center = center;
  }
  toLambda() {
    return new App({
      left: new App({ left: this.center.toLambda(), right: this.left.toLambda() }),
      right: this.right.toLambda()
    });
  }
  render(extra: ?{ noParens?: boolean }) {
    return <InfixComp ast={this} extra={extra}/>;
  }
  toJSON() {
    return {
      type: 'Infix',
      left: this.left.toJSON(),
      center: this.center.toLambda(),
      right: this.right.toJSON()
    };
  }
  static fromJSON(o: Object): Infix {
    return new Infix({
      left: Ast.fromJSON(o.left),
      center: Var.fromJSON(o.center),
      right: Ast.fromJSON(o.right)
    });
  }
  toString() {
    return `(${String(this.left)} \`${String(this.center)}\` ${String(this.right)})`;
  }
}

Ast.jsonParsers.Infix = Infix.fromJSON;
