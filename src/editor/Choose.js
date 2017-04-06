// @flow

import React from 'react';

import { Ast } from '../ast/Ast';

export class Choose extends React.Component {
  change = (newNode: () => Ast) => () => {
    if (this.props.choose) this.props.choose(newNode());
  }
  render() {
    const { choose, choises } = this.props;
    return <div>
      {choose ? choises.map(({ name, newNode }) => 
        <div key={name} onClick={this.change(newNode)}>{name}</div>
      ): null}
    </div>;
  }
}
