// Simple Parser Grammar for PEG.js
// ==========================
//

Parse
  = _ expr: (
    EmptyObj
  / Dict
  / List
  / Expression
 ) _ {return expr;}

Dict "dictionary"
  = head: '{' _? expr1:(String / Number) _? ':' _? expr2:(Expression / List / Dict)
    tail: (',' _? exprk:(String / Number) _? ':' _? exprv:(Expression / List / Dict) _?) * '}' {
  	return '{' + expr1 + ': ' + expr2 + tail.reduce(function(result, element) {
      	return result + ', ' + element[2] + ': ' + element[6]
    }, '') + '}';
  }
  
List "list"
  = head: '[' _? expr1:Expression _? tail: (',' _? exprt:(Expression / List / Dict) _?) * ']' {
  	return '[' + expr1 + tail.reduce(function (result, element) {
      	return result + ', ' + element[2]
    }, '') + ']';
  }


Expression
  = _ head:ExprTerm _ tail:( ExprOperator _ ExprTerm _)* {
      return tail.reduce(function(result, element) {
      	return result + ' ' + element[0] + ' ' + element[2]
    }, head);
  }

ExprOperator = "+" / "-" / "*" / "/" / "%" / "&&" / "||" / ConditionalSymbols { return text() }

ExprTerm "term"
  = "(" _ expr:Expression _ ")" { return '(' + expr + ')'; }
  / Func
  / MobiusFilter
  / MobiusAttr
  / MobiusQuery
  / ListSlice
  / ListItem
  / Negation
  / Boolean
  / Identifier
  / Number
  / String

Func "function call"
  = expr1:IdentifierUnmod _ '(' _ arg1: (Dict/ List / Expression / String) ?
    tail: (',' _ argn: (Dict/ List / Expression / String) _ ) * ')' {
    const rep = expr1 // <<<<<<<<<<< FUNCTION CALL >>>>>>>>>>>
  	return rep + '(' + (arg1? arg1: '') + tail.reduce(function(result, element) {
      	return result + ', ' + element[2]
    }, '') + ')';
  }
  
ListSlice
  = _ list: Identifier _ '[' _ from: Expression _ ':' _ to: Expression ? _ ']' _ { 
  if (to) return list + '.slice(' + from + ', ' + to + ')'
  return list + '.slice(' + from + ')'
  }

// SIMPLE TERMS 
ListItem
  = _ expr1: Identifier _ recursive: ( '[' _ Expression _ ']' _)+  { 
    return recursive.reduce((r, e) => r + '[pythonList(' + e[2] + ', ' + r + '.length)]', expr1); 
  }

MobiusAttr
  = _ expr1: (MobiusQuery / MobiusAttrTerm)? _ '@' _ expr2: IdentifierUnmod expr3:('[' Expression ']')? { 
    if (expr3) return 'mfn.attrib.Get(' + expr1 + ', [\'' + expr2 +'\', ' + expr3[1] + '])'
    return 'mfn.attrib.Get(' + expr1 + ', \'' + expr2 +'\')'
  }
 
MobiusQuery
  = _ expr1: (MobiusAttrTerm)? _ '#' _ expr2: MobiusName _ recursive: ( '#' _ MobiusName _ )* {
    if (recursive.length > 0) {
      const str = 'mfn.query.Get(\'' + expr2 + '\', ' + expr1 + ')'
      return recursive.reduce((result, element) => 'mfn.query.Get(\'' + element[2] + '\', '+ result + ')', str);
    }
    return 'mfn.query.Get(\'' + expr2 + '\', ' + expr1 + ')';
  }

MobiusFilter 
  = _ expr1: (MobiusQuery / MobiusAttrTerm)? _ '?' _ '@' _ expr2: IdentifierUnmod li:('[' Expression ']')? _ condSym:ConditionalSymbols _ expr3: Expression { 
  if (li) return 'mfn.query.Filter('+ expr1+ ', ['+ expr2 + ', ' + li[1] + '], '+condSym +', '+expr3+')'; 
  return 'mfn.query.Filter('+ expr1+ ', ['+ expr2 + ', null], '+condSym +', '+expr3+')'; 
  }

MobiusAttrTerm = 
    Func
  / ListSlice
  / ListItem
  / Identifier
  
// BASIC TEMRS
Negation "Negation"
  = op: ('!'/'-') _ expr: (ExprTerm) { return op + expr;}

Identifier "Identifier"
  = [a-zA-Z_][a-zA-Z0-9_\-]* {
    const VAR_USED = null
    return text() + '_';
  }
  
IdentifierUnmod "Attribute Name"
  = [a-zA-Z_][a-zA-Z0-9_\-]* { return text(); }
  
MobiusName "Mobius Name"
  = ('ps' / 'pt' / 'pl' / 'pg' / 'co'
     / '_v' / '_t' / '_e' / '_w' / 'mo') { return text(); }

ConditionalSymbols "Compare"
  = ('===' / '==' / '!=' / '<=' / '>='/ '<' / '>') { return text(); }

Number "Number" = neg: '-'? num: (PositiveFloat / PositiveInteger) {return (neg? neg: '') + num; }
  
PositiveInteger "Integer" = [0-9]+  { return text(); }
  
PositiveFloat "Float" = [0-9]* '.' [0-9]+ { return text(); }
  
String "String" = StringDbl / StringSgl

StringDbl "String - Double Quote" = '"' [^\"\n]+ '"' { return text(); }
  
StringSgl "String - Single Quote" = "'" [^\'\n]* "'" { return text(); }

Boolean "Boolean" = bool: (BooleanTrue / BooleanFalse) { return bool;}
BooleanTrue "Boolean true" = [Tt][Rr][Uu][Ee] { return 'true'; }
BooleanFalse "Boolean false" = [Ff][Aa][Ll][Ss][Ee] { return 'false'; }

EmptyObj = EmptyList / EmptyDict
EmptyList = _ ("[" _ "]") { return '[]'; }
EmptyDict = _ ("{" _ "}") { return '{}'; }

_ "whitespace" = [ \t\n\r]*