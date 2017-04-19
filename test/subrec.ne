@builtin "whitespace.ne"

@{%
  class Atom { constructor(data) { this.data = data } }
  class Tuple { constructor(data) { this.data = data } }
%}

MAIN -> _ TUPLEPART _ {% d => d[1] %}

TUPLE -> "(" _ TUPLEPART _ ")" {% d => new Tuple(d[2]) %}

TUPLEPART -> TUPLEPART __ TUPLEPART {% d => [].concat(d[0], d[2]) %} | TUPLE | ATOM

ATOM -> [^\s()\n]:+ {% d => new Atom(d[0].join('')) %}
