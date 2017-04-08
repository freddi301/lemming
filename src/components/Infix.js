// @flow

import React from 'react';
import { styles } from './styles';

import { Ast as AstAst } from '../ast/Ast';
import { Var as AstVar } from '../ast/Var';
import { Infix as AstInfix } from '../ast/Infix';
import { selected } from '../editor';

export class Infix extends React.Component<
  void,
  { ast: AstInfix, extra: ?{ noParens?: boolean } },
  { leftIsSelected: boolean, rightIsSelected: boolean, centerIsSelected: boolean }
> {
  state = { leftIsSelected: false, rightIsSelected: false, centerIsSelected: false }
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
  selectedCenter = (e: Event) => {
    e.stopPropagation();
    this.setState({ centerIsSelected: true });
    selected.publish({
      ast: this.props.ast.center,
      insert: (a: AstAst) => {
        if (a instanceof AstVar) {
          this.props.ast.center = a;
          this.forceUpdate();
        }
      }
    });
  }
  deselectCenter = () => { this.setState({ centerIsSelected: false }); }
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
    return <div className={`${styles.container} ${styles.row}`}>
      <div onFocus={this.selectedLeft} onBlur={this.deselectLeft} className={`${styles.container} ${styles.row}`}>
        {extra && extra.noParens ? null: <span onClick={this.selectedLeft}>(</span>}
          <div
            className={`${styles.container} ${this.state.leftIsSelected ? styles.selected : ''}`}
            onKeyUp={this.tabOnLeft}
          >
            {this.props.ast.left.render(
              this.props.ast.left instanceof AstInfix ? { noParens: true } : void 0
            )}
          </div>
      </div>
      <div onFocus={this.selectedCenter} onBlur={this.deselectCenter} className={`${styles.container} ${styles.row} ${this.state.centerIsSelected ? styles.selected : ''} ${styles.infix}`}>
          &nbsp;
          {this.props.ast.center.render()}
          &nbsp;
      </div>
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
