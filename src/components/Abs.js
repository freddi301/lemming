// @flow

import React from 'react';
import { styles } from './styles';

import { Abs as AstAbs } from '../ast/Abs';
import { Ast as AstAst } from '../ast/Ast';
import { selected } from '../editor';

export class Abs extends React.Component<void, { ast: AstAbs }, void> {
  selectedBody = (e: Event) => {
    e.stopPropagation();
    selected.publish({
      ast: this.props.ast.body,
      insert: (a: AstAst) => {
        this.props.ast.body = a;
        this.forceUpdate();
      }
    });
  }
  render() {
    return <div className={`${styles.container}`}>
      λ
      {this.props.ast.head.render()}
      .
      <div className={`${styles.dib}`} onClick={this.selectedBody}>
        {this.props.ast.body.render()}
      </div>
    </div>;
  }
}
