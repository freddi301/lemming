// @flow

import { css } from 'glamor';

export const styles = {
  container: css({
    /*':hover': {
      border: '1px solid gray',
      borderRadius: '3px',
      padding: '5px'
    },
    'transition': 'padding 500ms',*/
    display: 'flex',
    fontFamily: `"Courier New", Courier, monospace`
  }),
  row: css({ flexDirection: 'row' }),
  column: css({ flexDirection: 'column' })
};
