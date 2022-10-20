// Simple Parser Grammar for PEG.js
// ==========================
//

Parse
  = _ expr: (
    Expression
  / LongElement
  / Dict
  / List
  / EmptyObj
 ) _ { return expr; }

Dict "dictionary"
  = head: '{' _? expr1:(String / Number / IdentifierUnmod) _? ':' _? expr2:(Expression / List / Dict)
    tail: (',' _? exprk:(String / Number / IdentifierUnmod) _? ':' _? exprv:(Expression / List / Dict) _?) * '}' {
  	return '{' + expr1 + ': ' + expr2 + tail.reduce(function(result, element) {
      	return result + ', ' + element[2] + ': ' + element[6]
    }, '') + '}';
  }
  
List "list"
  = head: '[' _? expr1:(Expression / List / Dict) _? tail: (',' _? exprt:(Expression / List / Dict) _?) * ']' {
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
    tail: (',' _ argn: (Dict/ List / Expression / String) _ ) * ')' {
    const rep = options.funcReplace[expr1]
  	return rep + '(' + (arg1? arg1: '') + tail.reduce(function(result, element) {
      	return result + ', ' + element[2]
    }, '') + ')';
  }
  
LongElement
  = _ expr: LongElmTerm _ tail: ( LongElmTail _) + {
    return tail.reduce((r, e) =>  e[0].replace(/<<RESULT>>/g, r), expr)
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
    if (to) return '<<RESULT>>.slice(' + from + ', ' + to + ')'
    return '<<RESULT>>.slice(' + from + ')'
  }

// SIMPLE TERMS 
ListItem
  = '[' _ idx: Expression _ ']' { 
    return '<<RESULT>>[pythonList(' + idx + ', <<RESULT>>.length)]'; 
  }

MobiusAttr
  = '@' _ attr: IdentifierUnmod ls:('[' Expression ']')? { 
    if (ls) return 'mfn.attrib.Get(<<RESULT>>, [\'' + attr +'\', ' + ls[1] + '])'
    return 'mfn.attrib.Get(<<RESULT>>, \'' + attr +'\')'
  }
 
MobiusFilter 
  = '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')? _ condSym:ConditionalSymbols _ condVal: Expression { 
  if (li) return 'mfn.query.Filter(<<RESULT>>, [\''+ attr + '\', ' + li[1] + '], \''+condSym +'\', '+condVal+')'; 
  return 'mfn.query.Filter(<<RESULT>>, [\''+ attr + '\', null], \''+condSym +'\', '+condVal+')'; 
  }

MobiusQuery
  = '#' _ eType: MobiusName {
    return 'mfn.query.Get(\'' + eType + '\', <<RESULT>>)';
  }

MobiusNullAttr
  = _ '@' _ attr: IdentifierUnmod ls:('[' Expression ']')? { 
    if (ls) return 'mfn.attrib.Get(null, [\'' + attr +'\', ' + ls[1] + '])'
    return 'mfn.attrib.Get(null, \'' + attr +'\')'
  }
 
MobiusNullFilter 
  = _ '?' _ '@' _ attr: IdentifierUnmod li:('[' Expression ']')? _ condSym:ConditionalSymbols _ condVal: Expression { 
  if (li) return 'mfn.query.Filter(null, ['+ attr + ', ' + li[1] + '], '+condSym +', '+condVal+')'; 
  return 'mfn.query.Filter(null, ['+ attr + ', null], '+condSym +', '+condVal+')'; 
  }

MobiusNullQuery
  = _ '#' _ eType: MobiusName _ recursive: ( '#' _ MobiusName _ )* {
    if (recursive.length > 0) {
      const str = 'mfn.query.Get(\'' + eType + '\', null)'
      return recursive.reduce((result, element) => 'mfn.query.Get(\'' + element[2] + '\', '+ result + ')', str);
    }
    return 'mfn.query.Get(\'' + eType + '\', null)';
  }


// BASIC TEMRS
Negation "Negation"
  = op: ('!'/'-') _ expr: (ExprTerm) { return op + expr;}

Identifier "Identifier"
  = [a-zA-Z_][a-zA-Z0-9_\-]* {
    if (options.specialVars.has(text())) {
      if (options.funcReplace[text()]){
          return 'JSON.parse(JSON.stringify(' + options.funcReplace[text()] + '))';
      } 
      return text();
    }
    options.varUsed.add(text());
    return text() + '_';
  }
  
IdentifierUnmod "Attribute Name"
  = [a-zA-Z_][a-zA-Z0-9_\-]* { return text(); }
  
MobiusName "Mobius Name"
  = ('ps' / 'pt' / 'pl' / 'pg' / 'co'
     / '_v' / '_t' / '_e' / '_w' / 'mo') { return text(); }

ConditionalSymbols "Compare"
  = ('===' / '==' / '!==' / '!=' / '<=' / '>='/ '<' / '>') { return text(); }

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

_ = [ \t\n\r]*