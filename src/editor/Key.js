// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import { css } from 'glamor';

export const Key = (props) => <div className={style}>{props.children}</div>;

const style = css({
  display: 'inline-block',
  borderRadius: '4px',
  border: '1px solid gray',
  padding: '0px 5px',
  margin: '2px',
});
