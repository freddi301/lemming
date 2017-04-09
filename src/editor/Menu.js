// @flow

import React from 'react';
import { styles } from './styles';
import { Editor } from './';
import { Button } from './Button'; // eslint-disable-line no-unused-vars

export class Menu extends React.Component<void, { actions: Editor }, void> {
  render() {
    const actions = this.props.actions;
    return <div className={styles.menu}>
      <div>
        <Button onClick={actions.selectRoot}>root</Button>|
        <Button onClick={actions.run}>run</Button>|
        <Button onClick={actions.save}>save</Button>|
        <Button onClick={actions.export}>export</Button>|
        <Button onClick={actions.import}>import</Button>
      </div>
      <div className={styles.hr}/>
    </div>;
  }
}
