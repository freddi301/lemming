// @flow

import { expect } from 'chai';
import { isEqual } from 'lodash';

type Term = string | Array<Term>;

type Rule = [ Term, typeof IS, Term ];

const IS = '->';
const VAR = '$';

function match(left: Term, term: Term): ?Array<Rule> {
  if (left === term) return [];
  if (left instanceof Array && left[0] === VAR) return [ [ [ left[1], VAR ], IS, term ] ];
  if (left instanceof Array && term instanceof Array && left.length === term.length) {
    let scope = [];
    for (let i = 0; i < left.length; i++) {
      const param = match(left[i], term[i]);
      if(!param) return null;
      scope = scope.concat(param);
    }
    return scope;
  }
  return null;
}

function sub(rules: Array<Rule>, term: Term): Term {
  for (let [left, _, right] of rules) { // eslint-disable-line no-unused-vars
    const scope = match(left, term);
    if (scope) return subrec(scope.concat(rules), right);
  }
  if (term instanceof Array) {
    return term.map(item => sub(rules, item));
    /*let i = 0;
    while(i < term.length) {
      const subbed = sub(rules, term[i]);
      if (subbed !== term[i]) return term.slice(0, i).concat([subbed], term.slice(i + 1));
      i++;
    }*/
  }
  return term;
}

function subrec(rules: Array<Rule>, term: Term): Term {
  let lastSubbed = term;
  let nextSubbed = term;
  do {
    lastSubbed = nextSubbed;
    nextSubbed = sub(rules, lastSubbed);
  } while (!isEqual(lastSubbed, nextSubbed));
  return nextSubbed;
}


describe('bool not', () => {
  it('works', () => {
    const rules = [
      [ ['not', 'true'], IS, 'false' ],
      [ ['not', 'false'], IS, 'true' ],
    ];
    expect(sub(rules, 'true')).to.equal('true');
    expect(sub(rules, 'false')).to.equal('false');
    expect(sub(rules, ['not', 'true'])).to.equal('false');
    expect(sub(rules, ['not', 'false'])).to.equal('true');
    expect(sub(rules, ['not', ['not', 'false']])).to.deep.equal(['not', 'true']);
    expect(subrec(rules, ['not', ['not', 'false']])).to.equal('false');
    expect(subrec(rules, ['not', ['not', ['not', 'false']]])).to.equal('true');
  });
});

describe('vars', () => {
  it('works', () => {
    expect(match([VAR, 'x'], 'milk')).to.deep.equal([[ ['x', VAR], IS, 'milk' ]]);
    expect(match(['pack', [VAR, 'item']], ['pack', 'milk'])).to.deep.equal([ [ ['item', VAR], IS, 'milk' ] ]);
    expect(subrec([
      [ ['pack', [VAR, 'item']], IS, ['Package', ['item', VAR]] ]
    ], ['pack', 'milk'])).to.deep.equal(['Package', 'milk']);
    expect(match([[VAR, 'x'], [VAR, 'y']], ['milk', 'egg'])).to.deep.equal([[ ['x', VAR], IS, 'milk' ], [ ['y', VAR], IS, 'egg' ]]);
    expect(subrec([
      [ ['doublepack', [VAR, 'itemA'], [VAR, 'itemB']], IS, ['DoublePackage', ['itemA', VAR], ['itemB', VAR]] ]
    ], ['doublepack', 'milk', 'egg'])).to.deep.equal(['DoublePackage', 'milk', 'egg']);
  });
});

describe('recursion', () => {
  it('works', () => {
    const rules = [
      [ ['inc', ['number', '1']], IS, ['number', '2'] ],
      [ ['inc', ['number', '2']], IS, ['number', '3'] ],
      [ ['inc', ['number', '3']], IS, ['number', '4'] ],
      [ ['inc', ['number', '4']], IS, ['number', '5'] ],
      [ ['rec', ['number', '5'], [VAR, 'data']], IS, ['enc', ['data', VAR]] ],
      [ ['rec', ['number', [VAR, 'step']], [VAR, 'data']], IS, ['rec', ['inc', ['number', ['step', VAR]]], ['enc', ['data', VAR]]] ],
    ];
    expect(subrec(rules, ['rec', ['number', '5'], ['foo', 'bar']])).to.deep.equal(['enc', ['foo', 'bar']]);
    const scope1 = match(rules[5][0], ['rec', ['number', '1'], ['foo', 'bar']]);
    expect(scope1).to.deep.equal([
      [ ['step', VAR], IS, '1' ],
      [ ['data', VAR], IS, ['foo', 'bar'] ],
    ]);
    expect(subrec(rules, ['inc', ['inc', ['number', '1']]])).to.deep.equal(['number', '3']);
    expect(subrec(rules, ['rec', ['number', '1'], ['foo', 'bar']])).to.deep.equal(['enc', ['enc', ['enc', ['enc', ['enc', ['foo', 'bar']]]]]]);
  });
});
