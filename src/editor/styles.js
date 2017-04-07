// @flow

import { css } from 'glamor';

export const styles: {[key: string]: string} = {
  menu: css({
    padding: '2px'
  }),
  root: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }),
  main: css({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  }),
  left: css({
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column'
  }),
  source: css({
    flexGrow: 2,
    paddingLeft: '2px',
    overflow: 'auto',
  }),
  result: css({
    display: 'flex',
    flexGrow: 1,
    paddingLeft: '2px',
    overflow: 'auto'
  }),
  column: css({
    flexDirection: 'column',
  })
};
