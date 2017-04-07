// @flow

import React from 'react';
import { styles } from './styles';

import { Sas as AstSas } from '../ast/Sas';
import { Ast as AstAst } from '../ast/Ast';
import { selected } from '../editor';

export class Sas extends React.Component<void, { ast: AstSas }, void> {
  selectedRight = (e: Event) => {
    e.stopPropagation();
    selected.publish({
      ast: this.props.ast.right,
      insert: (a: AstAst) => {
        this.props.ast.right = a;
        this.forceUpdate();
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
    return <div className={`${styles.container} ${styles.column}`}>
      <div className={`${styles.container} ${styles.row}`}>
        <div>
          {this.props.ast.left.render()}
        </div>
        <span>&nbsp;=&nbsp;</span>
        <div onClick={this.selectedRight}>
          {this.props.ast.right.render()}
        </div>
      </div>
      <div className={`${styles.container}`} onClick={this.selectedBody}>
        {this.props.ast.body.render()}
      </div>
    </div>;
  }
}
