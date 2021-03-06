// @flow

import { Ast } from './Ast';
import { Var } from './Var';
import { Abs } from './Abs';
import { App } from './App';

export class Sas extends Ast {
  left: Var;
  right: Ast;
  body: Ast;
  constructor({ left, right, body }: { left: Var, right: Ast, body: Ast }) {
    super();
    this.left = left;
    this.right = right;
    this.body = body;
  }
  toLambda() {
    return new App({
      left: new Abs({
        head: this.left.toLambda(),
        body: this.body.toLambda()
      }),
      right: this.right.toLambda()
    });
  }
  static defaultNewNode = () => new Sas({ left: new Var({ name: 'x' }), right: new Var({ name: 'x' }), body: new Var({ name: 'x' }) });
  toJSON() {
    return {
      type: 'Sas',
      left: this.left.toJSON(),
      right: this.right.toJSON(),
      body: this.body.toJSON()
    };
  }
  static fromJSON(o: Object): Sas {
    return new Sas({
      left: Var.fromJSON(o.left),
      right: Ast.fromJSON(o.right),
      body: Ast.fromJSON(o.body)
    });
  }
  toString() {
    return `${String(this.left)} = ${String(this.right)} ${String(this.body)}`;
  }
}

Ast.jsonParsers.Sas = Sas.fromJSON;
