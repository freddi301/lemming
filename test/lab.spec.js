// @flow

import { expect } from 'chai';
//import { Map } from 'immutable';
//import { Ast } from '../src/ast';

export class Type {
  equals(t: Type) { return this === t; }
  fits(t: Type): boolean { return this.equals(t); }
  and(t: Type) { return new IntersectionType({ left: this, right: t }); }
  or(t: Type) { return new UnionType({ left: this, right: t }); }
}

export class AbstractionType extends Type {
  head: Type;
  body: Type;
  constructor({ head, body }: { head: Type, body: Type }) {
    super();
    this.head = head;
    this.body = body;
  }
  fits(t: Type) {
    if (t instanceof AbstractionType) {
      return this.head.fits(t.head) && this.body.fits(t.body);
    }
    return false;
  }
}

export class UnionType extends Type {
  left: Type;
  right: Type;
  constructor({ left, right }: { left: Type, right: Type }) {
    super();
    this.left = left;
    this.right = right;
  }
  fits(t: Type) {
    if(t instanceof UnionType) {
      return this.left.fits(t.left) || this.left.fits(t.right) || this.right.fits(t.left) || this.right.fits(t.right);
    }
    return this.left.fits(t) || this.right.fits(t);
  }
}

export class IntersectionType extends Type {
  left: Type;
  right: Type;
  constructor({ left, right }: { left: Type, right: Type }) {
    super();
    this.left = left;
    this.right = right;
  }
  fits(t: Type) {
    if (t instanceof IntersectionType) {
      return (this.left.fits(t.left) && this.right.fits(t.right)) || (this.left.fits(t.right) && this.right.fits(t.left));
    }
    return this.left.fits(t) && this.right.fits(t);
  }
}

describe('type equality', () => {
  it('works', () => {
    const t1 = new Type;
    const t2 = new Type;
    expect(t1.equals(t1)).to.equal(true);
    expect(t1.equals(t2)).to.equal(false);
  });
});

describe('abstraction type', () => {
  it('works', () => {
    const t1 = new Type;
    const t2 = new Type;
    const t3 = new AbstractionType({ head: t1, body: t2 });
    expect(t3.equals(t1)).to.equal(false);
    expect(t3.equals(t2)).to.equal(false);
    expect(t3.equals(t3)).to.equal(true);
    expect(t3.fits(t3)).to.equal(true);
    const t4 = new AbstractionType({ head: t1, body: t1 });
    expect(t3.fits(t4)).to.equal(false);
    expect(t3.fits(new AbstractionType({ head: t1, body: t2 }))).to.equal(true);
  });
  it('works with union type', () => {
    const t1 = new Type;
    const t2 = new Type;
    const t3 = new Type;
    const ta1 = new AbstractionType({ head: t1.or(t2), body: t3 });
    const ta2 = new AbstractionType({ head: t1, body: t3 });
    const ta3 = new AbstractionType({ head: t2, body: t3 });
    expect(ta1.fits(ta2)).to.equal(true);
    expect(ta1.fits(ta3)).to.equal(true);
    expect(ta2.fits(ta1)).to.equal(false);
    expect(ta3.fits(ta1)).to.equal(false);
  });
});

describe('union type', () => {
  it('works', () => {
    const t1 = new Type;
    const t2 = new Type;
    expect(t1.or(t2).fits(t1)).to.equal(true);
    expect(t1.or(t2).fits(t2)).to.equal(true);
    expect(t2.or(t1).fits(t1)).to.equal(true);
    expect(t2.or(t1).fits(t2)).to.equal(true);
    expect(t1.fits(t2.or(t1))).to.equal(false);
    expect(t2.fits(t2.or(t1))).to.equal(false);
    expect(t2.or(t1).fits(t2.or(t1))).to.equal(true);
    expect(t1.or(t2).fits(t1.or(t2))).to.equal(true);
  });
});

describe('intersection type', () => {
  it('works', () => {
    const t1 = new Type;
    const t2 = new Type;
    expect(t1.and(t2).fits(t1.and(t2))).to.equal(true);
    expect(t1.and(t2).fits(t2.and(t1))).to.equal(true);
    expect(t2.and(t1).fits(t1.and(t2))).to.equal(true);
    expect(t2.and(t1).fits(t2.and(t1))).to.equal(true);
    expect(t2.and(t1).fits(t1)).to.equal(false);
    expect(t2.and(t1).fits(t2)).to.equal(false);
    expect(t2.and(t1).fits(t1.or(t2))).to.equal(false);
  });
});

/*
export function check({ ast, types }: { ast: Ast, types: Map<string, Type> }) {

  throw new Error('invalid ast');
}
*/
