// @flow

import React from 'react';
import { styles } from './styles';

import { Abs as AstAbs } from '../ast/Abs';
import { Ast as AstAst } from '../ast/Ast';
import { App as AstApp } from '../ast/App';
import { selected } from '../editor';

export class Abs extends React.Component<
  void,
  { ast: AstAbs },
  { bodyIsSelected: boolean, headIsSelected: boolean }
> {
  state = { bodyIsSelected: false, headIsSelected: false };
  selectedBody = (e: Event) => {
    e.stopPropagation();
    this.setState({ bodyIsSelected: true });
    selected.publish({
      ast: this.props.ast.body,
      insert: (a: AstAst) => {
        this.props.ast.body = a;
        this.forceUpdate();
      }
    });
  }
  deselectBody = () => { this.setState({ bodyIsSelected: false }); }
  selectedHead = (/*e: Event*/) => {
    // e.stopPropagation();
    this.setState({ headIsSelected: true });
  }
  deselectHead = () => { this.setState({ headIsSelected: false }); }
  toggleNewLine = () => {
    this.props.ast.newLine = !this.props.ast.newLine;
    this.forceUpdate();
  }
  render() {
    return <div className={`${styles.container} ${this.props.ast.newLine ? styles.column : styles.row}`}>
      <div className={`${styles.container} ${styles.row}`}>
        <span className={styles.abs}>λ</span>
        <span
          onFocus={this.selectedHead} onBlur={this.deselectHead}
          onKeyDown={this.tabOnHead}
          className={`${styles.container} ${this.state.headIsSelected ? styles.selected : ''}`}
        >
          {this.props.ast.head.render()}
        </span>
        <span onClick={this.toggleNewLine}>.</span>
      </div>
      <div className={`${styles.container} ${styles.row}`}>
        {this.props.ast.newLine ? <span>&nbsp;</span> : null}
        <div
          onFocus={this.selectedBody} onBlur={this.deselectBody}
          className={`${styles.container} ${this.state.bodyIsSelected ? styles.selected : ''}`}
        >
          {this.props.ast.body.render(this.props.ast.body instanceof AstApp ? { noParens: true } : null)}
        </div>
      </div>
    </div>;
  }
  stopPropagation = (e: Event) => e.stopPropagation();
  tabOnHead = (e: KeyboardEvent) => {
    if (e.key === 'Tab') this.selectedBody(e);
  }
}
