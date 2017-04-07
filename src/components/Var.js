// @flow

import React from 'react';
import { styles } from './styles';

import { Var as AstVar } from '../ast/Var';

export class Var extends React.Component<void, { ast: AstVar }, { editing: boolean, name: string}> {
  state = { editing: false, name: this.props.ast.name }
  editName = () => this.setState({ editing: true });
  updateName = (e: { target: HTMLInputElement }) => this.setState({ name: e.target.value });
  changeName = () => {
    this.props.ast.name = this.state.name;
    this.setState({ editing: false });
  };
  finishEditingOnTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') this.changeName();
  }
  render() {
    return <div className={`${styles.container}`} onClick={this.editName}>
      {this.state.editing ?
        <input
          value={this.state.name}
          onChange={this.updateName} onBlur={this.changeName} autoFocus
          style={{ width: `${(this.state.name.length || 1) * 8}px` }}
          className={styles.seamlessInput}
          onKeyUp={this.finishEditingOnTab}
        />
        : this.props.ast.name
      }
    </div>;
  }
}
