// @flow

import { css } from 'glamor';

export const styles = {
  menu: css({
    display: 'flex',
    flexDirection: 'column'
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
  }),
  hr: css({
    backgroundImage: 'linear-gradient(left, rgba(0,0,0,0), rgba(255,255,255, 0.1) 4px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) calc(100% - 20px), rgba(255,255,255, 0.1) calc(100% - 4px), rgba(0,0,0,0) 100%)',
    height: '1px', width: '100%'
  }),
  vr: css({
    backgroundImage: 'linear-gradient(top, rgba(0,0,0,0), rgba(255,255,255, 0.1) 2px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) calc(100% - 10px), rgba(255,255,255, 0.1) calc(100% - 2px), rgba(0,0,0,0) 100%)',
    width: '1px', height: '100%'
  })
};
