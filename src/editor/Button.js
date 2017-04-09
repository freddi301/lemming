// @flow

import React from 'react';
import { css } from 'glamor';

const style = css({
  display: 'inline-flex',
  padding: '0px 0.5em',
  cursor: 'default',
  fontWeight: 'bold', fontFamily: `'Inconsolata', monospace`, color: 'white',
  transition: 'background-color 300ms',
  ':hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
  ':active': { backgroundColor: 'rgba(255,255,255,0.5)' }
});

export class Button extends React.Component {
  render() {
    return <span className={style}>
      <span {...this.props}>{this.props.children}</span>
    </span>;
  }
}
