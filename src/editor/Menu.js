// @flow

import React from 'react';
import { styles } from './styles';
import { Editor } from './';

export class Menu extends React.Component<void, { actions: Editor }, void> {
  render() {
    const actions = this.props.actions;
    return <div className={styles.menu}>
      <button onClick={actions.selectRoot}>root</button>
      <button onClick={actions.save}>save</button>
      <button onClick={actions.export}>export</button>
      <button onClick={actions.import}>import</button>
    </div>;
  }
}
