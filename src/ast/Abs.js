// @flow

import { Ast } from './Ast';
import { Var } from './Var';

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
  static defaultNewNode = () => new Abs({ head: new Var({ name: 'x' }), body: new Var({ name: 'x' }) });
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
