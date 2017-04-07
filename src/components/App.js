// @flow

import React from 'react';
import { styles } from './styles';

import { App as AstApp } from '../ast/App';
import { Ast as AstAst } from '../ast/Ast';
import { selected } from '../editor';

export class App extends React.Component<void, { ast: AstApp, extra: ?{ noParens?: boolean } }, void> {
  selectedLeft = (e: Event) => {
    e.stopPropagation();
    selected.publish({
      ast: this.props.ast.left,
      insert: (a: AstAst) => {
        this.props.ast.left = a;
        this.forceUpdate();
      }
    });
  }
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
  render() {
    const extra = this.props.extra;
    return <div className={`${styles.container} ${styles.row}`}>
      <div onClick={this.selectedLeft} className={`${styles.container} ${styles.row}`}>
        {extra && extra.noParens ? null: <span>(</span>}
        {this.props.ast.left.render(
          this.props.ast.left instanceof AstApp ? { noParens: true } : void 0
        )}
      </div>
      <span>&nbsp;</span>
      <div onClick={this.selectedRight} className={`${styles.container} ${styles.row}`}>
        {this.props.ast.right.render()}
        {extra && extra.noParens ? null : <span>)</span> }
      </div>
    </div>;
  }
}
