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
  toggleNewLine = () => {
    this.props.ast.newLine = !this.props.ast.newLine;
    this.forceUpdate();
  }
  render() {
    if (this.props.ast.newLine) {
      return <div className={`${styles.container} ${styles.row}`}>
        <div className={`${styles.container} ${styles.row}`}>
          <span>λ</span>
          {this.props.ast.head.render()}
          <span onClick={this.toggleNewLine}>.</span>
        </div>
        <div className={`${styles.container} ${styles.column}`} onClick={this.selectedBody}>
          <span>&nbsp;</span>
          {this.props.ast.body.render()}
        </div>
      </div>;
    }
    return <div className={`${styles.container} ${styles.row}`}>
      <span>λ</span>
      {this.props.ast.head.render()}
      <span onClick={this.toggleNewLine}>.</span>
      <div onClick={this.selectedBody}>
        {this.props.ast.body.render()}
      </div>
    </div>;
  }
}
