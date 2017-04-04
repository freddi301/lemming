// @flow

import React from 'react';
import { styles } from './styles';

import { Abs as AstAbs } from '../ast/Abs';
import { Ast as AstAst } from '../ast/Ast';
import { insert } from '../editor';

export class Abs extends React.Component<void, { ast: AstAbs }, void> {
  selectedHead = (e: Event) => {
    e.stopPropagation();
    insert.publish((a: AstAst) => {
      this.props.ast.head = a;
      this.forceUpdate();
    });
  }
  selectedBody = (e: Event) => {
    e.stopPropagation();
    insert.publish((a: AstAst) => {
      this.props.ast.body = a;
      this.forceUpdate();
    });
  }
  render() {
    return <div className={`${styles.container}`}>
      λ
      <div className={`${styles.dib}`} onClick={this.selectedHead}>
        {this.props.ast.head.render()}
      </div>
      .
      <div className={`${styles.dib}`} onClick={this.selectedBody}>
        {this.props.ast.body.render()}
      </div>
    </div>;
  }
}
