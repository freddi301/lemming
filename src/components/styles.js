// @flow

import { css } from 'glamor';

export const styles = {
  container: css({
    ':hover': {
      border: '1px solid gray',
      borderRadius: '3px',
      padding: '5px'
    },
    'transition': 'padding 500ms',
    display: 'inline-block',
    fontFamily: `"Courier New", Courier, monospace`
  }),
  dib: css({ display: 'inline-block' })
};
