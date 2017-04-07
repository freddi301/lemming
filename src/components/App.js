// @flow

import React from 'react';
import { styles } from './styles';

import { App as AstApp } from '../ast/App';
import { Ast as AstAst } from '../ast/Ast';
import { selected } from '../editor';

export class App extends React.Component<
  void,
  { ast: AstApp, extra: ?{ noParens?: boolean } },
  { leftIsSelected: boolean, rightIsSelected: boolean }
> {
  state = { leftIsSelected: false, rightIsSelected: false }
  selectedLeft = (e: Event) => {
    e.stopPropagation();
    this.setState({ leftIsSelected: true });
    selected.publish({
      ast: this.props.ast.left,
      insert: (a: AstAst) => {
        this.props.ast.left = a;
        this.forceUpdate();
      }
    });
  }
  deselectLeft = () => { this.setState({ leftIsSelected: false }); }
  selectedRight = (e: Event) => {
    e.stopPropagation();
    this.setState({ rightIsSelected: true });
    selected.publish({
      ast: this.props.ast.right,
      insert: (a: AstAst) => {
        this.props.ast.right = a;
        this.forceUpdate();
      }
    });
  }
  deselectRight = () => { this.setState({ rightIsSelected: false }); }
  tabOnLeft = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      this.deselectLeft();
      this.selectedRight(e);
    }
  }
  shiftTabOnRigth = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey) {
      this.deselectRight();
      this.selectedLeft(e);
    }
  }
  render() {
    const extra = this.props.extra;
    return <div
      className={`${styles.container} ${styles.row}`}>
      <div onFocus={this.selectedLeft} onBlur={this.deselectLeft} className={`${styles.container} ${styles.row}`}>
        {extra && extra.noParens ? null: <span onClick={this.selectedLeft}>(</span>}
          <div
            className={`${styles.container} ${this.state.leftIsSelected ? styles.selected : ''}`}
            onKeyUp={this.tabOnLeft}
          >
            {this.props.ast.left.render(
              this.props.ast.left instanceof AstApp ? { noParens: true } : void 0
            )}
          </div>
      </div>
      <span>&nbsp;</span>
      <div onFocus={this.selectedRight} onBlur={this.deselectRight} className={`${styles.container} ${styles.row}`}>
        <div
          className={`${styles.container} ${this.state.rightIsSelected ? styles.selected : ''}`}
          onKeyUp={this.shiftTabOnRigth}
        >
          {this.props.ast.right.render()}
        </div>
        {extra && extra.noParens ? null : <span>)</span> }
      </div>
    </div>;
  }
}
