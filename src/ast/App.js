// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { Ast } from './Ast';
import { App as AppComp } from '../components/App';  // eslint-disable-line no-unused-vars

export class App extends Ast {
  left: Ast;
  right: Ast;
  constructor({ left, right }: { left: Ast, right: Ast }) {
    super();
    this.left = left;
    this.right = right;
  }
  render() {
    return <AppComp ast={this}/>;
  }
}
