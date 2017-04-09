// @flow

import React from 'react';

import { Ast } from '../ast/Ast';
import { Key } from './Key'; // eslint-disable-line no-unused-vars

export class Choose extends React.Component {
  change = (newNode: () => Ast) => () => {
    if (this.props.choose) this.props.choose(newNode());
  }
  render() {
    const { choose, choises } = this.props;
    return <div>
      {choose ? Object.keys(choises).map(name =>
        <div key={name} onClick={this.change(choises[name].new)}>
          {name} <Key>ctrl</Key>+<Key>shift</Key>+<Key>{choises[name].shortcut}</Key>
        </div>
      ): null}
    </div>;
  }
}
