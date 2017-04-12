// @flow

import React from 'react';
import { css } from 'glamor';

const style = css({
  color: 'rgba(255,255,255,0.05)',
  ':hover': { color: '#e06c75' },
  display: 'inline-block',
  cursor: 'pointer',
  userSelect: 'none',
  margin: '0px 3px'
});

export class SelectSweetSpot extends React.Component {
  props: { select: (e: Event) => void, children?: React.Children };
  render() {
    return <span onClick={this.props.select} className={style}>◉</span>;
  }
}
