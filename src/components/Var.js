// @flow

import React from 'react';
import { styles } from './styles';

import { Var as AstVar } from '../ast/Var';

export class Var extends React.Component<void, { ast: AstVar }, void> {
  /*selectedName = (e: Event) => {
    e.stopPropagation();
    console.log(this.props.ast.name);
  }*/
  render() {
    return <div className={`${styles.container}`}>
      {this.props.ast.name}
    </div>;
  }
}
