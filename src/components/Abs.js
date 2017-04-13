// @flow

import React from 'react';
import { styles } from './styles';
import { css } from 'glamor';
import { Abs as AstAbs } from '../ast/Abs';
import { Ast as AstAst } from '../ast/Ast';
import { App as AstApp } from '../ast/App';
import { selected } from '../editor';
import { SelectSweetSpot } from './SelectSweetSpot';
import { Var } from './Var';
import { Ast } from './Ast';
import { App } from './App';

const style = {
  dot: css({
    userSelect: 'none',
    cursor: 'pointer',
    ':hover': { color: 'orange' }
  })
};

export class Abs extends React.Component {
  static defaultProps = { lambda: true };
  props: { ast: AstAbs };
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
        {this.props.lambda ? <span className={styles.abs}>λ</span> : null}
        <span className={`${styles.container} ${this.state.headIsSelected ? styles.selected : ''}`}>
          <Var ast={this.props.ast.head}/>
        </span>
        <span className={style.dot} onClick={this.toggleNewLine}>.</span>
      </div>
      <div className={`${styles.container} ${styles.row}`}>
        <SelectSweetSpot select={this.selectedBody}/>
        {this.props.ast.newLine ? <span>&nbsp;</span> : null}
        <div className={`${styles.container} ${this.state.bodyIsSelected ? styles.selected : ''}`}>
          {
            this.props.ast.body instanceof AstAbs ? <Abs ast={this.props.ast.body} lambda={false}/> :
            this.props.ast.body instanceof AstApp ? <App ast={this.props.ast.body} parens={false}/> :
            <Ast ast={this.props.ast.body}/>
          }
        </div>
      </div>
    </div>;
  }
  autoDeselectHead = ({ ast }: { ast: AstAst }) => { if (ast !== this.props.ast.head) this.deselectHead(); };
  autoDeselectBody = ({ ast }: { ast: AstAst }) => { if (ast !== this.props.ast.body) this.deselectBody(); };
  componentWillMount() {
    selected.subscribe(this.autoDeselectHead);
    selected.subscribe(this.autoDeselectBody);
  }
  componentWillUnmount() {
    selected.unsubscribe(this.autoDeselectHead);
    selected.unsubscribe(this.autoDeselectBody);
  }
}
