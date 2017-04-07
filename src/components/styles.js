// @flow

import { css } from 'glamor';

export const styles = {
  container: css({
    display: 'flex',
    fontFamily: `monospace`,
    borderRadius: '5px',
  }),
  row: css({ flexDirection: 'row' }),
  column: css({ flexDirection: 'column' }),
  selected: css({ backgroundColor: 'rgba(150,150,150,0.5)' }),
  seamlessInput: css({
    outline: 'none',
    appearance: 'none',
    font: 'inherit',
    border: '0px solid black',
    backgroundColor: 'transparent',
    ':focus': {
      outline: 'none',
      padding: '0px'
    }
  }),
};
