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
  render() {
    return <div className={`${styles.container}`} onClick={this.editName}>
      {this.state.editing ?
        <input value={this.state.name} onChange={this.updateName} onBlur={this.changeName} autoFocus/>
        :this.props.ast.name
      }
    </div>;
  }
}
