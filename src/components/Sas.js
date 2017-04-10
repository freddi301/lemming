// @flow

import React from 'react';
import { styles } from './styles';
import { Button } from './Button'; // eslint-disable-line no-unused-vars
import { Sas as AstSas } from '../ast/Sas';
import { Ast as AstAst } from '../ast/Ast';
import { App as AstApp } from '../ast/App';
import { Var as AstVar } from '../ast/Var';
import { selected } from '../editor';

export class Sas extends React.Component<
  void,
  { ast: AstSas },
  { isLeftSelected: boolean, isRightSelected: boolean, isBodySelected: boolean }
> {
  state = { isLeftSelected: false, isRightSelected: false, isBodySelected: false }
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
  addSas = () => {
    const body = this.props.ast.body;
    this.props.ast.body = new AstSas({
      left: new AstVar({ name: 'x' }),
      right: new AstVar({ name: 'x' }),
      body
    });
    this.forceUpdate();
  }
  removeSas = () => {
    // this.props.parentInsert(this.props.ast.body);
  }
  render() {
    return <div className={`${styles.container} ${styles.column}`}>
      <div className={`${styles.container} ${styles.row}`}>
        <div>
          {this.props.ast.left.render()}
        </div>
        <span>&nbsp;=&nbsp;</span>
        <div onClick={this.selectedRight}>
          {this.props.ast.right.render(this.props.ast.right instanceof AstApp ? { noParens: true } : null)}
        </div>
        <span>&nbsp;</span>
        <Button onClick={this.addSas}>+</Button>
        <Button onClick={this.removeSas}>-</Button>
      </div>
      <div className={`${styles.container}`} onClick={this.selectedBody}>
        {this.props.ast.body.render()}
      </div>
    </div>;
  }
}
