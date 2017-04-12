// @flow

import React from 'react';
import { css } from 'glamor';

const style = css({
  display: 'inline-flex',
  cursor: 'default',
  padding: '0px 0.5em', margin: '2px',
  fontWeight: 'bold', fontFamily: `'Inconsolata', monospace`, color: 'white',
  transition: 'background-color 300ms',
  borderRadius: '4px',
  border: '1px solid rgba(255,255,255,0.5)',
  userSelect: 'none',
  ':hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
  ':active': { backgroundColor: 'rgba(255,255,255,0.5)' }
});

export class Button extends React.Component {
  render() {
    const styleOverride = {};
    return <span className={style} style={styleOverride} {...this.props}>
      {this.props.children}
    </span>;
  }
}
