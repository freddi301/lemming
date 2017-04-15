// @flow

import React from 'react';
import { styles } from './styles';
import { css } from 'glamor';
import { App as AstApp } from '../ast/App';
import { Ast as AstAst } from '../ast/Ast';
import { selected, navKeys } from '../editor';
import { SelectSweetSpot } from './SelectSweetSpot';
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

export class App extends React.Component {
  static defaultProps = { parens: true };
  props: { ast: AstApp, selectParentLeft?: (e: Event) => void, selectParentRight?: (e: Event) => void };
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
    navKeys.publish({
      ArrowRight: this.selectedRight,
      ...(this.props.selectParentLeft ? { ArrowLeft: this.props.selectParentLeft } : {})
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
    navKeys.publish({
      ArrowLeft: this.selectedLeft,
      ...(this.props.selectParentRight ? { ArrowRight: this.props.selectParentRight } : {})
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
          {this.props.ast.left instanceof AstApp ?
            <App ast={this.props.ast.left} parens={false} selectParentRight={this.selectedRight}/> :
            <Ast ast={this.props.ast.left} selectParentRight={this.selectedRight}/>
          }
        </div>
      </div>
      <span>&nbsp;</span>
      <div className={`${styles.container} ${styles.row}`}>
        <div className={`${styles.container} ${this.state.rightIsSelected ? styles.selected : ''}`}>
          <Ast ast={this.props.ast.right} selectParentLeft={this.selectedLeft}/>
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
