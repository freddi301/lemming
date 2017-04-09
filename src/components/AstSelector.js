// @flow

import React from 'react';
import { css } from 'glamor';

const outer = css({
  display: 'flex',
  flexDirection: 'column',
});

const bar = {
  default: css({
    width: '100%',
    height: '3px',
  }),
  hovered: css({
    backgroundColor: 'yellow',
  })
};

export class AstSelector extends React.Component {
  state = { hovered: false };
  mouseOver = (e: MouseEvent) => {
    e.stopPropagation();
    this.setState({ hovered: true });
  }
  mouseOut = (e: MouseEvent) => {
    e.stopPropagation();
    this.setState({ hovered: false });
  }
  render() {
    return <div className={outer} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
      {<div className={`${bar.default} ${this.state.hovered ? bar.hovered : ''}`}></div>}
      <div>{this.props.children}</div>
    </div>;
  }
}
