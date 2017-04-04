// @flow

import React from 'react'; // eslint-disable-line no-unused-vars

export class Ast {
  render(): * {
    return <span>invalid ast</span>;
  }
  toJSON() { return {}; }
  static jsonParsers: {[key: string]: (o: Object) => Ast} = {};
  static fromJSON(o: { type: string }) {
    return Ast.jsonParsers[o.type](o);
  }
}
