// @flow

import { css } from 'glamor';

export const styles = {
  container: css({
    display: 'flex',
    fontFamily: `'Inconsolata', monospace`,
    borderRadius: '5px',
  }),
  infix: css({ color: '#54afef', fontWeight: 'bold' }),
  red: css({ color: '#e06c75' }),
  abs: css({ color: '#c678dd', fontWeight: 'bold' }),
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

css.insert(`@import url('https://fonts.googleapis.com/css?family=Inconsolata:400,700&subset=latin-ext');`);
