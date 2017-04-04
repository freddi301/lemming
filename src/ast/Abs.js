// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast } from './Ast';
import { Var } from './Var';
import { Abs as AbsComp } from '../components/Abs';  // eslint-disable-line no-unused-vars

export class Abs extends Ast {
  head: Var;
  body: Ast;
  constructor({ head, body }: { head: Var, body: Ast }) {
    super();
    this.head = head;
    this.body = body;
  }
  render() {
    return <AbsComp ast={this}/>;
  }
}
