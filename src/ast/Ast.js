// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast as AstComp } from '../components/Ast'; // eslint-disable-line no-unused-vars

export class Ast {
  toJSON() { return {}; }
  static jsonParsers: {[key: string]: (o: Object) => Ast} = {};
  static fromJSON(o: { type: string }) {
    return Ast.jsonParsers[o.type](o);
  }
  toLambda(): Ast {
    return this;
  }
  render(): React$Element<any> { return <AstComp/>; }
}
