// @flow

import React from 'react';
import { styles } from './styles';
import { SelectSweetSpot } from './SelectSweetSpot';
import { Ast as AstAst } from '../ast/Ast';
import { Var as AstVar } from '../ast/Var';
import { Infix as AstInfix } from '../ast/Infix';
import { selected } from '../editor';
import { css } from 'glamor';
import { Ast } from './Ast';

const style = {
  parens: {
    base: css({ userSelect: 'none', cursor: 'default' }),
    lit: css({ color: 'yellow' })
  }
};

const parens = (props, char) => (props.props.parens ? <span
  onMouseEnter={props.highlightParens}
  onMouseOut={props.unhighlightParens}
  className={`${style.parens.base} ${props.state.highlightParens ? style.parens.lit : ''}`}
>{char}</span> : null);


export class Infix extends React.Component {
  static defaultProps = { parens: true };
  props: { ast: AstInfix };
  state = { leftIsSelected: false, rightIsSelected: false, centerIsSelected: false, highlightParens: false }
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
  render() {
    return <div className={`${styles.container} ${styles.row}`}>
      <div className={`${styles.container} ${styles.row}`}>
        {parens(this, '(')}
        <div className={`${styles.container} ${this.state.leftIsSelected ? styles.selected : ''}`}>
          <Ast ast={this.props.ast.left}/>
        </div>
      </div>
      <div className={`${styles.container} ${styles.row} ${this.state.centerIsSelected ? styles.selected : ''} ${styles.infix}`}>
          <SelectSweetSpot select={this.selectedLeft}/>
          <Ast ast={this.props.ast.center}/>
          <SelectSweetSpot select={this.selectedRight}/>
      </div>
      <div className={`${styles.container} ${styles.row}`}>
        <div className={`${styles.container} ${this.state.rightIsSelected ? styles.selected : ''}`}>
          <Ast ast={this.props.ast.right}/>
        </div>
        {parens(this, ')')}
      </div>
    </div>;
  }
  highlightParens = () => { this.setState({ highlightParens: true }); }
  unhighlightParens = () => { this.setState({ highlightParens: false }); }
  autoDeselectLeft = ({ ast }: { ast: AstAst }) => { if (ast !== this.props.ast.left) this.deselectLeft(); };
  autoDeselectRight = ({ ast }: { ast: AstAst }) => { if (ast !== this.props.ast.right) this.deselectRight(); };
  componentWillMount() {
    selected.subscribe(this.autoDeselectLeft);
    selected.subscribe(this.autoDeselectRight);
  }
  componentWillUnmount() {
    selected.unsubscribe(this.autoDeselectLeft);
    selected.unsubscribe(this.autoDeselectRight);
  }
}
