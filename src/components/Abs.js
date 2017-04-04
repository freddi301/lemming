// @flow

import React from 'react';
import { styles } from './styles';

import { Abs as AstAbs } from '../ast/Abs';
import { Ast as AstAst } from '../ast/Ast';
import { Var as VarAst } from '../ast/Var';
import { selected } from '../editor';

export class Abs extends React.Component<void, { ast: AstAbs }, void> {
  selectedHead = (e: Event) => {
    e.stopPropagation();
    selected.publish({
      ast: this.props.ast.head,
      insert: (a: AstAst) => {
        if (a instanceof VarAst) {
          this.props.ast.head = a;
          this.forceUpdate();
        } else {
          throw new Error('invalid ast');
        }
      }
    });
  }
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
