// @flow

import React from 'react';
import { styles } from './styles';

import { App as AstApp } from '../ast/App';
import { Ast as AstAst } from '../ast/Ast';
import { selected } from '../editor';

export class App extends React.Component<void, { ast: AstApp }, void> {
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
    return <div className={`${styles.container}`}>
      <div className={`${styles.dib}`} onClick={this.selectedLeft}>
        ({this.props.ast.left.render()}
      </div>
      &nbsp;
      <div className={`${styles.dib}`} onClick={this.selectedRight}>
        {this.props.ast.right.render()})
      </div>
    </div>;
  }
}
