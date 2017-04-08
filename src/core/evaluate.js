// @flow

import { Ast, Var, App, Abs } from '../ast';

export interface Scope {
  get(i: Var): Ast;
  set(i: Var, l: Ast): Scope;
  pairs(): Array<{ key: Var, value: Ast }>
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
  dict: { [id: string]: Ast };
  constructor(dict: { [id: string]: Ast } = Object.create(null)) { this.dict = dict; }
  get(i: Var): Ast {
    const got = this.dict[i.name];
    if (!got) throw new AstNotFoundInScopeError(i, this);
    return got;
  }
  set(i: Var, l: Ast): StringScope {
    return new StringScope({ ...this.dict, [i.name]: l });
  }
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

export type Evaluated = { ast: Ast, scope: Scope };

export const evaluate = ({ ast, scope }: Evaluated): Evaluated => {
  if (ast instanceof App) {
    const left = ast.left instanceof Abs ? ast.left : null;
    const right = ast.right instanceof Abs ? ast.right : null;
    if (left && right) {
      if (left.systemAbstraction) left.systemAbstraction(right);
      return evaluate({ ast: left.body, scope: scope.set(left.head, right) });
    } else if (left) {
      const rhs = evaluate({ ast: ast.right, scope }).ast;
      // if (rhs instanceof Var) return evaluate({ ast: left.body, scope: scope.set(left.head, rhs) });
      return evaluate({ ast: new App({ left, right: rhs }), scope });
    } else if (right) {
      const r = evaluate({ ast: ast.left, scope });
      // if (r.ast instanceof Var) return { ast: new App({ left: r.ast, right: evaluate({ ast: right, scope }).ast }), scope };
      return evaluate({ ast: new App({ left: r.ast, right }), scope: r.scope });
    } else  {
      const l = evaluate({ ast: ast.left, scope: scope });
      //if (l.ast instanceof Var) return { scope, ast: new App({ left: l.ast, right: evaluate({ ast: ast.right, scope }).ast }) };
      return evaluate({ ast: new App({ left: l.ast, right: ast.right }), scope: l.scope });
    }
  } else if (ast instanceof Var) {
    return { ast: scope.get(ast), scope };
  } else if (ast instanceof Abs) {
    return { ast, scope };
    /* const freeScope = scope.set(ast.head, ast.head);
    return {
      ast: new Abs({
        head: ast.head,
        body: evaluate({ ast: ast.body, scope: freeScope }).ast
      }),
      scope
    }; */
  }
  throw new InvalidAstError(ast, scope);
};

const logit = new Abs({ head: new Var({ name: 'x' }), body: new Var({ name: 'x' }) });
logit.systemAbstraction = x => console.log(x); // eslint-disable-line

export const SystemAbstractions = new StringScope({ '#logit': logit });

export const e = (ast: Ast) => evaluate({ ast, scope: SystemAbstractions });
