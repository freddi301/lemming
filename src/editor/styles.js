// @flow

import { css } from 'glamor';

export const styles: {[key: string]: string} = {
  menu: css({
    padding: '2px'
  }),
  root: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#282c34',
    color: '#9da5b4'
  }),
  main: css({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  }),
  left: css({
    display: 'flex',
    flexGrow: '3',
    flexDirection: 'column'
  }),
  right: css({
    flexGrow: '1'
  }),
  source: css({
    flexGrow: 5,
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
