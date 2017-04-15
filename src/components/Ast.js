// @flow

import React from 'react';
import * as astn from '../ast';
import { Var as VarComp } from './Var';
import { App as AppComp } from './App';
import { Abs as AbsComp } from './Abs';
import { Sas as SasComp } from './Sas';
import { Infix as InfixComp } from './Infix';

export class Ast extends React.Component {
  props: { ast: astn.Ast, selectParentLeft?: (e: Event) => void, selectParentRight?: (e: Event) => void };
  render() {
    const ast = this.props.ast;
    const common = {
      ...(this.props.selectParentLeft ? { selectParentLeft: this.props.selectParentLeft } : {}),
      ...(this.props.selectParentRight ? { selectParentLeft: this.props.selectParentRight } : {}),
    };
    if (ast instanceof astn.Var) return <VarComp ast={ast} {...common}/>;
    if (ast instanceof astn.App) return <AppComp ast={ast} {...common}/>;
    if (ast instanceof astn.Abs) return <AbsComp ast={ast} {...common}/>;
    if (ast instanceof astn.Sas) return <SasComp ast={ast} {...common}/>;
    if (ast instanceof astn.Infix) return <InfixComp ast={ast} {...common}/>;
    return <span>ivalid ast</span>;
  }
}
