// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast } from './Ast';
import { Var } from './Var';
import { Abs as AbsComp } from '../components/Abs';  // eslint-disable-line no-unused-vars

export class Abs extends Ast {
  head: Var;
  body: Ast;
  newLine: boolean;
  systemAbstraction: ?(ast: Ast) => void;
  constructor({ head, body }: { head: Var, body: Ast }) {
    super();
    this.head = head;
    this.body = body;
  }
  toLambda() {
    return new Abs({ head: this.head.toLambda(), body: this.body.toLambda() });
  }
  render() {
    return <AbsComp ast={this}/>;
  }
  toJSON() {
    return { type: 'Abs', head: this.head.toJSON(), body: this.body.toJSON() };
  }
  toString() {
    return `λ${String(this.head)}.${String(this.body)}`;
  }
}

Ast.jsonParsers.Abs = o => {
  return new Abs({ head: Var.fromJSON(o.head), body: Ast.fromJSON(o.body) });
};
