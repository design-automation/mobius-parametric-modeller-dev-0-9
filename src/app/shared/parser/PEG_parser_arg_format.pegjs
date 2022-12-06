// Simple Parser Grammar for PEG.js
// ==========================
//

Parse
  = _ expr: (
    NoBracketList
  / Expression
  / LongElement
  / Dict
  / List
  / EmptyObj
 ) _ {return expr;}

Dict "dictionary"
  = head: '{' _? expr1:(String / Number / IdentifierUnmod) _? ':' _? expr2:(Expression / List / Dict)
    tail: (',' _? (String / Number / IdentifierUnmod) _? ':' _? (Expression / List / Dict) _?) * '}' {
  	return '{' + expr1 + ': ' + expr2 + tail.reduce(function(result, element) {
      	return result + ', ' + element[2] + ': ' + element[6]
    }, '') + '}';
  }
  
List "list"
  = head: '[' _? expr1:(Expression / List / Dict) _? tail: (','? _? exprt:(Expression / List / Dict) _?) * closingBrack: ']'? {
    if (!closingBrack) {
      throw Error('Error: missing closing "]" in "' + text() + '"')
    }
    let expr = '[' + expr1
    for (const element of tail) {
      if (!element[0]) {
        throw Error('Error: missing "," in "' + text() + '"')

      }
      expr += ', ' + element[2]
    }
    return expr + ']'
  }

NoBracketList "list"
  = (Expression / List / Dict) _? (','? _? exprt:(Expression / List / Dict) _?) + {
    throw Error('Error: "[" and "]" expected for "' + text() + '"')
  }

Expression
  = _ head:ExprTerm _ tail:( ExprOperator? _ ExprTerm _)* {
    for (let i = 0; i < tail.length; i++) {
      if (!tail[i][0]) {
        if (i === 0) {
          throw Error('Error: missing operator between "'+ head +'" and "'+ tail[0][2] +'" in "' + text() + '"')
        }
        throw Error('Error: missing operator between "'+ tail[i-1][2] +'" and "'+ tail[i][2] +'" in "' + text() + '"')
      }
    }
    return tail.reduce(function(result, element) {
      return result + ' ' + element[0] + ' ' + element[2]
    }, head);
  }

ExprOperator = "+" / "-" / "*" / "/" / "%" / "&&" / "||" / ConditionalSymbols { return text() }

ExprTerm "expression, number, string or identifier"
  = "(" _ expr:Expression _ ")" { return '(' + expr + ')'; }
  / LongElement
  / List
  / Func
  / MobiusNullFilter
  / MobiusNullAttr
  / MobiusNullQuery
  / Negation
  / EmptyObj
  / Boolean
  / Identifier
  / Number
  / String

Func "function call"
  = expr1:IdentifierUnmod _ '(' _ arg1: (Dict/ List / Expression / String) ?
    tail: (',' _ argn: (Dict/ List / Expression / String) _ ) * closingBrack:')'? {
    if (!closingBrack) {
      throw Error('Error: missing closing ")" in "' + text() + '"')
    }
    const rep = expr1 // <<<<<<<<<<< FUNCTION CALL >>>>>>>>>>>
  	return rep + '(' + (arg1? arg1: '') + tail.reduce(function(result, element) {
      	return result + ', ' + element[2]
    }, '') + ')';
  }

LongElement
  = _ expr: LongElmTerm _ tail: ( LongElmTail _) + {
    return tail.reduce((r, e) =>  r + e[0], expr)
  }

LongElmTerm
  = "(" _ expr:Expression _ ")" { return '(' + expr + ')'; }
  / Dict
  / List
  / Func
  / MobiusNullFilter
  / MobiusNullAttr
  / MobiusNullQuery
  / Negation
  / Boolean
  / Identifier
  / Number
  / String

LongElmTail
  = MobiusFilter
  / MobiusAttr
  / MobiusQuery
  / ListSlice
  / ListItem

ListSlice
  = '[' _ from: Expression? _ ':' _ to: Expression? _ ']' { 
    return '[' + (from ? from:'') + ':' + (to ? to:'') + ']';
  }

// SIMPLE TERMS 
ListItem
  = '[' _ idx: Expression _ ']' { 
    return '[' + idx + ']'; 
  }

MobiusAttr
  = '@' _ attr: IdentifierUnmod ls:('[' Expression ']')? { 
    if (ls) return '@' + attr + '[' + ls[1] + ']';
    return '@' + attr;
  }
  / _ '@' _ { throw Error('Error: attribute name required after "@"') }

MobiusFilter
  = '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')? _ condSym: ConditionalSymbols _ condVal: Expression { 
  if (li) return '?@' + attr + '[' + li[1] + ']' + condSym + condVal; 
  return '?@' + attr + condSym + condVal; 
  }
  / _  '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')? _ condSym: ConditionalSymbols  { throw Error('Error: missing condition value in "' + text() + '"') }
  / _  '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')?   { throw Error('Error: missing conditional clause in "' + text() + '"') }
  / _ '?' _ '@' _ { throw Error('Error: attribute name required after "?@" in "' + text() + '"') }
  / _ '?' _ { throw Error('Error: "@" required after "?" in "' + text() + '"') }

MobiusQuery
  = '#' _ eType: MobiusName {
    return '#' + eType;
  }
  / _ '#' _ { throw Error('Error: object types ("ps", "pt", "pl", "pg", "co", "_v", "_t", "_e" or "_w") required after "#" in "' + text() + '"') }

MobiusNullAttr
  = _ '@' _ attr: IdentifierUnmod ls:('[' Expression ']')? { 
    if (ls) return '@' + attr + '[' + ls[1] + ']';
    return '@' + attr;
  }
  / _ '@' _ { throw Error('Error: attribute name required after "@"') }
  
MobiusNullFilter
  = _ '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')? _ condSym: ConditionalSymbols _ condVal: Expression { 
  if (li) return '?@' + attr + '[' + li[1] + ']' + condSym + condVal; 
  return '?@' + attr + condSym + condVal; 
  }
  / _  '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')? _ condSym: ConditionalSymbols  { throw Error('Error: missing condition value in "' + text() + '"') }
  / _  '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')?   { throw Error('Error: missing conditional clause in "' + text() + '"') }
  / _ '?' _ '@' _ { throw Error('Error: attribute name required after "?@" in "' + text() + '"') }
  / _ '?' _ { throw Error('Error: "@" required after "?" in "' + text() + '"') }
  
MobiusNullQuery
  = _ '#' _ eType: MobiusName _ recursive: ( '#' _ MobiusName _)* { 
    if (recursive.length > 0) {
      return recursive.reduce((result, element) => result + '#' + element[2] + ' ', '#' + eType + ' ');
    }
    return '#' + eType;
  }
  / _ '#' _ { throw Error('Error: object types ("ps", "pt", "pl", "pg", "co", "_v", "_t", "_e" or "_w") required after "#" in "' + text() + '"') }


// BASIC TEMRS
Negation "Negation"
  = op: ('!'/'-') _ expr: (ExprTerm) { return op + expr;}

Identifier "Identifier"
  = [a-zA-Z_][a-zA-Z0-9_\-]* { return text(); }
  
IdentifierUnmod "Attribute Name"
  = [a-zA-Z_][a-zA-Z0-9_\-]* { return text(); }
  
MobiusName "Mobius Name"
  = ('ps' / 'pt' / 'pl' / 'pg' / 'co'
     / '_v' / '_t' / '_e' / '_w' / 'mo') { return text(); }

ConditionalSymbols
  = ('===' / '==' / '!==' / '!=' / '<=' / '>='/ '<' / '>') { return text(); }

Number "Number" = neg: '-'? num: (PositiveFloat / PositiveInteger) {return (neg? neg: '') + num; }
  
PositiveInteger "Integer" = [0-9]+  { return text(); }
  
PositiveFloat "Float" = [0-9]* '.' [0-9]+ { return text(); }
  
String "String" = StringDbl / StringSgl

StringDbl "String - Double Quote" 
  = '"' [^\"\n]+ '"' { return text(); }
  / '""'
  
StringSgl "String - Single Quote" 
  = "'" [^\'\n]* "'" { return text(); }
  / "''"

Boolean "Boolean" = BooleanTrue / BooleanFalse
BooleanTrue "Boolean true" = [Tt][Rr][Uu][Ee] { return 'true'; }
BooleanFalse "Boolean false" = [Ff][Aa][Ll][Ss][Ee] { return 'false'; }

EmptyObj = EmptyList / EmptyDict
EmptyList = _ ("[" _ "]") { return '[]'; }
EmptyDict = _ ("{" _ "}") { return '{}'; }

_ "whitespace" = [ \t\n\r]*