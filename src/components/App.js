// @flow

import React from 'react';
import { styles } from './styles';
import { css } from 'glamor';
import { App as AstApp } from '../ast/App';
import { Ast as AstAst } from '../ast/Ast';
import { selected } from '../editor';
import { SelectSweetSpot } from './SelectSweetSpot';

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

export class App extends React.Component {
  static defaultProps = { parens: true };
  props: { ast: AstApp };
  state = { leftIsSelected: false, rightIsSelected: false, highlightParens: false }
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
  render() {
    return <div
      className={`${styles.container} ${styles.row}`}>
      <div className={`${styles.container} ${styles.row}`}>
        {parens(this, '(')}
        <SelectSweetSpot select={this.selectedLeft}/>
        <div className={`${styles.container} ${this.state.leftIsSelected ? styles.selected : ''}`}>
          {this.props.ast.left.render()}
        </div>
      </div>
      <span>&nbsp;</span>
      <div className={`${styles.container} ${styles.row}`}>
        <div className={`${styles.container} ${this.state.rightIsSelected ? styles.selected : ''}`}>
          {this.props.ast.right.render()}
        </div>
        <SelectSweetSpot select={this.selectedRight}/>
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
