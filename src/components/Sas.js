// @flow

import React from 'react';
import { styles } from './styles';
import { Button } from './Button'; // eslint-disable-line no-unused-vars
import { Sas as AstSas } from '../ast/Sas';
import { Ast as AstAst } from '../ast/Ast';
import { Var as AstVar } from '../ast/Var';
import { selected } from '../editor';
import { SelectSweetSpot } from './SelectSweetSpot';

export class Sas extends React.Component {
  props: { ast: AstSas };
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
      insert: (a: AstAst) => {
        this.props.ast.body = a;
        this.forceUpdate();
      }
    });
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
    // this.props.parentInsert(this.props.ast.body);
  }
  render() {
    return <div className={`${styles.container} ${styles.column}`}>
      <div className={`${styles.container} ${styles.row}`}>
        <div className={`${this.state.isLeftSelected ? styles.selected : ''}`}>
          {this.props.ast.left.render()}
        </div>
        <span>&nbsp;=<SelectSweetSpot select={this.selectedRight}/></span>
        <div className={`${styles.container} ${this.state.isRightSelected ? styles.selected : ''}`}>
          {this.props.ast.right.render()}
        </div>
        <SelectSweetSpot select={this.selectedBody}/>
        <Button onClick={this.addSas}>+</Button>
        {/*<Button onClick={this.removeSas}>-</Button>*/}
      </div>
      <div className={`${styles.container} ${this.state.isBodySelected ? styles.selected : ''}`}>
        {this.props.ast.body.render()}
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
