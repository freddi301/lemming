// @flow

export class Ast {
  toJSON() { return {}; }
  static jsonParsers: {[key: string]: (o: Object) => Ast} = {};
  static fromJSON(o: { type: string }) {
    return Ast.jsonParsers[o.type](o);
  }
  toLambda(): Ast {
    return this;
  }
}
