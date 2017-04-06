// @flow

import { Ast, Var, App, Abs } from '../ast';

export interface Scope {
  get(i: Var): Abs;
  set(i: Var, l: Abs): Scope;
  pairs(): Array<{ key: Var, value: Abs }>
}

export class AstNotFoundInScopeError extends Error {
  identifier: Var;
  scope: Scope;
  constructor(i: Var, scope: Scope) {
    super(`identifier: ${String(i)} not found in scope: ${String(scope)}`);
    this.identifier = i;
    this.scope = scope;
  }
}

export class InvalidAstError extends Error {
  ast: Ast;
  scope: Scope;
  constructor(ast: Ast, scope: Scope) {
    super(`invalid ast`);
    this.ast = ast;
    this.scope = scope;
  }
}

export class StringScope {
  dict: { [id: string]: Abs };
  constructor(dict: { [id: string]: Abs } = {}) { this.dict = dict; }
  get(i: Var) { const got = this.dict[i.name]; if (!got) throw new AstNotFoundInScopeError(i, this); return got; }
  set(i: Var, l: Abs) { return new StringScope({ ...this.dict, [i.name]: l }); }
  pairs() {
    const pairs = [];
    for (const key of Object.keys(this.dict)) {
      pairs.push({ key: new Var({ name: key }), value: this.dict[key] });
    }
    return pairs;
  }
  toString() {
    return Object.keys(this.dict).map(key =>
      `${key} = ${String(this.dict[key])}`
    ).join('\n');
  }
}

export type Evaluated = { lambda: Abs, scope: Scope };

export const evaluate = ({ ast, scope }: { ast: Ast, scope: Scope }): Evaluated => {
  ast = ast.toLambda();
  if (ast instanceof App) {
    const left = ast.left instanceof Abs ? ast.left : null;
    const right = ast.right instanceof Abs ? ast.right : null;
    if (left && right) {
      return evaluate({ ast: left.body, scope: scope.set(left.head, right) });
    } else if (left) {
      return evaluate({ ast: new App({ left, right: evaluate({ ast: ast.right, scope }).lambda }), scope });
    } else if (right) {
      const r = evaluate({ ast: ast.left, scope });
      return evaluate({ ast: new App({ left: r.lambda, right }), scope: r.scope });
    } else  {
      const l = evaluate({ ast: ast.left, scope: scope });
      return evaluate({ ast: new App({ left: l.lambda, right: ast.right }), scope: l.scope });
    }
  } else if (ast instanceof Var) {
    return { lambda: scope.get(ast), scope };
  } else if (ast instanceof Abs) return { lambda: ast, scope };
  throw new InvalidAstError(ast, scope);
};

export const e = (ast: Ast) => evaluate({ ast, scope: new StringScope() });
