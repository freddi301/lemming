// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast } from './Ast';
import { Var as VarComp } from '../components/Var'; // eslint-disable-line no-unused-vars

export class Var extends Ast {
  name: string;
  constructor({ name }: { name: string }) {
    super();
    this.name = name;
  }
  render() {
    return <VarComp ast={this}/>;
  }
  toJSON() {
    return { type: 'Var', name: this.name };
  }
  static fromJSON(o: Object): Var {
    return new Var({ name: o.name });
  }
  toString() {
    return this.name;
  }
}

Ast.jsonParsers.Var = Var.fromJSON;
