// @flow

import React from 'react';
import { styles } from './styles';
import { Button } from './Button';
import { Sas as AstSas } from '../ast/Sas';
import { Ast as AstAst } from '../ast/Ast';
import { Var as AstVar } from '../ast/Var';
import { App as AstApp } from '../ast/App';
import { selected } from '../editor';
import { SelectSweetSpot } from './SelectSweetSpot';
import { Ast } from './Ast';
import { App } from './App';

export class Sas extends React.Component {
  props: { ast: AstSas, replaceMe?: (a: AstAst) => void };
  state = { isLeftSelected: false, isRightSelected: false, isBodySelected: false }
  selectedRight = (e: Event) => {
    e.stopPropagation();
    this.setState({ isRightSelected: true });
    selected.publish({
      ast: this.props.ast.right,
      insert: (a: AstAst) => {
        this.props.ast.right = a;
        this.forceUpdate();
      }
    });
  }
  deselectRight = () => this.setState({ isRightSelected: false });
  selectedBody = (e: Event) => {
    e.stopPropagation();
    this.setState({ isBodySelected: true });
    selected.publish({
      ast: this.props.ast.body,
      insert: this.insertBody
    });
  }
  insertBody = (a: AstAst) => {
    this.props.ast.body = a;
    this.forceUpdate();
  }
  deselectBody = () => this.setState({ isBodySelected: false });
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
    if (this.props.replaceMe) this.props.replaceMe(this.props.ast.body);
  }
  render() {
    return <div className={`${styles.container} ${styles.column}`}>
      <div className={`${styles.container} ${styles.row}`}>
        <div className={`${this.state.isLeftSelected ? styles.selected : ''}`}>
          <Ast ast={this.props.ast.left}/>
        </div>
        <span>
          &nbsp;=
          <SelectSweetSpot select={this.selectedRight}/>
        </span>
        <div className={`${styles.container} ${this.state.isRightSelected ? styles.selected : ''}`}>
          {
            this.props.ast.right instanceof AstApp ? <App ast={this.props.ast.right} parens={false}/> :
            <Ast ast={this.props.ast.right}/>
          }
        </div>
        <SelectSweetSpot select={this.selectedBody}/>
        <Button onClick={this.addSas}>+</Button>
        {this.props.replaceMe ? <Button onClick={this.removeSas}>-</Button> : null }
      </div>
      <div className={`${styles.container} ${this.state.isBodySelected ? styles.selected : ''}`}>
        {
          this.props.ast.body instanceof AstSas ? <Sas ast={this.props.ast.body} replaceMe={this.insertBody}/> :
          <Ast ast={this.props.ast.body}/>
        }
      </div>
    </div>;
  }
  autoDeselectBody = ({ ast }: { ast: AstAst }) => { if (ast !== this.props.ast.body) this.deselectBody(); };
  autoDeselectRight = ({ ast }: { ast: AstAst }) => { if (ast !== this.props.ast.right) this.deselectRight(); };
  componentWillMount() {
    selected.subscribe(this.autoDeselectBody);
    selected.subscribe(this.autoDeselectRight);
  }
  componentWillUnmount() {
    selected.unsubscribe(this.autoDeselectBody);
    selected.unsubscribe(this.autoDeselectRight);
  }
}
