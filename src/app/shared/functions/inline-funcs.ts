
const inline_query_expr = [
    ['#XX', 'The `#XX` expression  is used to get a list of connected entities. \n\nThe `XX` is a two letter code that specifies the type of entity that is required. They are as folows:\n* `ps`: positions\n* `_v`: vertices (topology)\n* `_e`: edges (topology)\n* `_w`: wires (topology)\n* `pt`: points (objects)\n* `pl`: polylines (objects)\n* `pg`: polygons (objects)\n* `co`: collections (groups of objects)\n\nThe expression will return a list of entities of the given type. For example:\n\n* `#ps` gets all the positions in the model\n* `1#pg` gets all the polygons in the model.\n'],
    ['entity#XX', 'The `entity#XX` expression is used to get a list of connected entities. \n\nThe `XX` is a two letter code that specifies the type of entity that is required. They are as folows:\n* `ps`: positions\n* `_v`: vertices (topology)\n* `_e`: edges (topology)\n* `_w`: wires (topology)\n* `pt`: points (objects)\n* `pl`: polylines (objects)\n* `pg`: polygons (objects)\n* `co`: collections (groups of objects)\n\nThe expression will return a list of entities of the given type.\n\nExamples going down the entity hierarchy:\n\n* `pline1#ps` gets all the positions for the polyline that is stored in the variable `pline1`.\n* `pgon1#_e` gets the edges from the polygon that is stored in the variable `pgon1`.\n\nExamples going up the entity hierarchy:\n\n* `posi1#pl` gets all the polylines that include the position that is stored in the variable `posi1`.\n* `edge1#pg` gets the polygons that include the edge stored in the variable `edge1`.\n\nNote that the `#` shorcut will always return a list of entities, even when only a single entity is returned. If you require just a single entity, then index notation can be used as follows:\n\n* `edge1#pg[0]` gets the first polygon that includes the edge stored in the variable `edge1`.\n'],
    ['entity@name', 'The `entity@name` expression is used to get attributes from entities in the model. For example:\n\n* `pgon1@abc` gets the value of an attribute called `abc` from the polygon that is stored in the variable `pgon1`. (Note that if an attribute with that name does not exist, then an error will be thrown.)\n* `posi1@xyz` gets the value of an attribute called `xyz` from the position that is stored in the variable `posi1`. ((Note that the `xyz` attribute is a built in attribute that stores the location of a position.)\n\n\n'],
    ['?@name == value', 'The `?@name == value` expression is used to filter a list of entities based on attribute values. The `?@` characters can be read as "where attribute". \n\nAny of the  following comparators can be used: `==`, `!=`, `>`, `>=`, `<`, `<=`.\n\nThe `?@name == value` exxpression is often compined with the `#XX` expression. For example:\n\n* `#pg ?@abc == 10` gets all the polygons in the model, and then filters them, returning only the polygons where the attribute `abc` has a value of `10`.\n* `pgon1#ps ?@xyz[2] > 10` gets the positions from the polygon that is stored in the variable `pgon1`, and then filters the positions, returning only the positions where the Z value is greater than 10.\n']
];

const constants = [
    'PI',
    'VX',
    'VY',
    'VZ',
    'VO',
    'RX',
    'RY',
    'RZ',
    'XY',
    'YZ',
    'ZX',
    'YX',
    'ZY',
    'XZ',
    'EUL',
    'PI2'
];

const conversion = [
    'boolean(val)',
    'number(val)',
    'string(val)',
    'numToCurr(num)',
    'numToStr(num)',
    'radToDeg(rad)',
    'degToRad(deg)'
];

const strings = [
    'len(s)',
    'strUpp(s)',
    'strLow(s)',
    'strTrim(s)',
    'strTrimL(s)',
    'strTrimR(s)',
    'strPadL(s1, max)',
    'strPadR(s1, max)',
    'strRepl(s1, s2, s3)',
    'strSub(s, from)',
    'strStarts(s1, s2)',
    'strEnds(s1, s2)',
    'strToJSON(s)'
];

const lists = [
    'len(list)',
    'range(start, end)',
    'listGet(list, index)',
    'listFind(list, val)',
    'listHas(list, val)',
    'listCount(list, val)',
    'listCopy(list)',
    'listRep(list, num)',
    'listJoin(...list)',
    'listFlat(list)',
    'listRot(list, rot)',
    'listSlice(list, start)',
    'listRev(list)',
    'listSort(list1, list2)',
    'listCull(list1, list2)',
    'listZip(lists)',
    'listEq(list1, list2)'
];

const dictionaries = [
    'len(dict)',
    'dictGet(list, index)',
    'dictKeys(dict)',
    'dictVals(dict)',
    'dictHasKey(dict, key)',
    'dictHasVal(dict, val)',
    'dictCopy(dict)',
    'dictFind(dict, val)',
    'dictEq(dict1, dict2)'
];

 const sets = [
    'setMake(list)',
    'setUni(list1, list2)',
    'setInt(list1, list2)',
    'setDif(list1, list2)'
];

 const vectors = [
    'vecAdd(v1, v2)',
    'vecSub(v1, v2)',
    'vecDiv(v, num)',
    'vecMult(v, num)',
    'vecSum(...v)',
    'vecAvg(...v)',
    'vecAvgDir(...v)',
    'vecLen(v)',
    'vecSetLen(v, num)',
    'vecNorm(v)',
    'vecRev(v)',
    'vecRot(v1, v2, a)',
    'vecFromTo(xyz1, xyz2)',
    'vecAng(v1, v2)',
    'vecAng2(v1, v2, n)',
    'vecDot(v1, v2)',
    'vecCross(v1, v2)',
    'vecEqual(v1, v2, tol)',
    'vecLtoG(v, p)',
    'vecGtoL(v, p)'
];

const colors = [
    'colFalse(val, min, max)',
    'colScale(val, min, max, sc)',
    'colFromStr(col_str)',
];

const planes = [
    'plnMake(o, x, xy)',
    'plnFromRay(r)',
    'plnCopy(p)',
    'plnMove(p, v)',
    'plnLMove(p, v)',
    'plnRot(p, r, ang)',
    'plnLRotX(p, ang)',
    'plnLRotY(p, ang)',
    'plnLRotZ(p, ang)'
];

const rays = [
    'rayMake(o, d)',
    'rayFromTo(xyz1, xyz2)',
    'rayCopy(r)',
    'rayMove(r, v)',
    'rayRot(r1, r2, a)',
    'rayLMove(r, d)',
    'rayFromPln(p)',
    'rayLtoG(v, p)',
    'rayGtoL(v, p)'
];

const random = [
    'rand(min, max)',
    'randInt(min, max)',
    'randPick(list, num)'
];

const arithmetic = [
    'abs(num)',
    'square(num)',
    'cube(num)',
    'pow(num, pow)',
    'sqrt(num)',
    'exp(num)',
    'log(num)',
    'log10(num)',
    'round(num)',
    'sigFig(num, f)',
    'ceil(num)',
    'floor(num)',
    'sum(list)',
    'prod(list)',
    'hypot(list)',
    'norm(list)',
    'isApprox(num1, num2, tol)',
    'isIn(num1, num2, num3)',
    'isWithin(num1, num2, num3)',
    'remap(num, d1, d2)'
];

const geometry = [
    'distance(a, b)',
    'distanceM(a, b)',
    'distanceMS(a, b)',
    'intersect(a, b)',
    'project(a, b)'
];

const statistics = [
    'min(list)',
    'max(list)',
    'mad(list)',
    'mean(list)',
    'median(list)',
    'mode(list)',
    'std(list)',
    'vari(list)'];

const trigonometry = [
    'sin(rad)',
    'asin(num)',
    'sinh(rad)',
    'asinh(num)',
    'cos(rad)',
    'acos(num)',
    'cosh(rad)',
    'acosh(num)',
    'tan(rad)',
    'atan(num)',
    'tanh(rad)',
    'atanh(num)',
    'atan2(num1, num2)'
];


const types = [
    'isNum(val)',
    'isInt(val)',
    'isFlt(val)',
    'isBool(val)',
    'isStr(val)',
    'isList(val)',
    'isDict(val)',
    'isVec2(val)',
    'isVec3(val)',
    'isCol(val)',
    'isRay(val)',
    'isPln(val)',
    'isNaN(val)',
    'isNull(val)',
    'isUndef(val)'
];

export const inline_func = [
    ['queries', inline_query_expr],
    ['constants', constants],
    ['conversion', conversion],
    ['strings', strings],
    ['lists', lists],
    ['dictionaries', dictionaries],
    ['sets', sets],
    ['vectors', vectors],
    ['rays', rays],
    ['planes', planes],
    ['colors', colors],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry],
    ['geometry', geometry],
    ['random', random],
    ['types', types],
];

export const inlineVarString =
`PI = __inline__.PI;
XY = __inline__.XY;
YZ = __inline__.YZ;
ZX = __inline__.ZX;
YX = __inline__.YX;
ZY = __inline__.ZY;
XZ = __inline__.XZ;
VX = __inline__.VX;
VY = __inline__.VY;
VZ = __inline__.VZ;
RX = __inline__.RX;
RY = __inline__.RY;
RZ = __inline__.RZ;
VO = __inline__.VO;
EUL = __inline__.EUL;
PI2 = __inline__.PI2;
isNum = __inline__.isNum;
isInt = __inline__.isInt;
isFlt = __inline__.isFlt;
isBool = __inline__.isBool;
isStr = __inline__.isStr;
isList = __inline__.isList;
isDict = __inline__.isDict;
isVec2 = __inline__.isVec2;
isVec3 = __inline__.isVec3;
isCol = __inline__.isCol;
isRay = __inline__.isRay;
isPln = __inline__.isPln;
isNaN = __inline__.isNaN;
isNull = __inline__.isNull;
isUndef = __inline__.isUndef;
strRepl = __inline__.strRepl;
strUpp = __inline__.strUpp;
strLow = __inline__.strLow;
strTrim = __inline__.strTrim;
strTrimR = __inline__.strTrimR;
strTrimL = __inline__.strTrimL;
strSub = __inline__.strSub;
strStarts = __inline__.strStarts;
strEnds = __inline__.strEnds;
strPadL = __inline__.strPadL;
strPadR = __inline__.strPadR;
strToJSON = __inline__.strToJSON;
sin = __inline__.sin;
asin = __inline__.asin;
sinh = __inline__.sinh;
asinh = __inline__.asinh;
cos = __inline__.cos;
acos = __inline__.acos;
cosh = __inline__.cosh;
acosh = __inline__.acosh;
tan = __inline__.tan;
atan = __inline__.atan;
tanh = __inline__.tanh;
atanh = __inline__.atanh;
atan2 = __inline__.atan2;
min = __inline__.min;
max = __inline__.max;
mad = __inline__.mad;
mean = __inline__.mean;
median = __inline__.median;
mode = __inline__.mode;
std = __inline__.std;
vari = __inline__.vari;
abs = __inline__.abs;
square = __inline__.square;
cube = __inline__.cube;
pow = __inline__.pow;
sqrt = __inline__.sqrt;
exp = __inline__.exp;
log = __inline__.log;
log10 = __inline__.log10;
round = __inline__.round;
sigFig = __inline__.sigFig;
ceil = __inline__.ceil;
floor = __inline__.floor;
sum = __inline__.sum;
prod = __inline__.prod;
hypot = __inline__.hypot;
norm = __inline__.norm;
isApprox = __inline__.isApprox;
isIn = __inline__.isIn;
isWithin = __inline__.isWithin;
remap = __inline__.remap;
distance = __inline__.distance;
distanceM = __inline__.distanceM;
distanceMS = __inline__.distanceMS;
intersect = __inline__.intersect;
project = __inline__.project;
range = __inline__.range;
len = __inline__.len;
listCount = __inline__.listCount;
listCopy = __inline__.listCopy;
listRep = __inline__.listRep;
listLast = __inline__.listLast;
listGet = __inline__.listGet;
listFind = __inline__.listFind;
listHas = __inline__.listHas;
listJoin = __inline__.listJoin;
listFlat = __inline__.listFlat;
listRot = __inline__.listRot;
listSlice = __inline__.listSlice;
listRev = __inline__.listRev;
listCull = __inline__.listCull;
listSort = __inline__.listSort;
listZip = __inline__.listZip;
listEq = __inline__.listEq;
dictGet = __inline__.dictGet;
dictKeys = __inline__.dictKeys;
dictVals = __inline__.dictVals;
dictHasKey = __inline__.dictHasKey;
dictHasVal = __inline__.dictHasVal;
dictFind = __inline__.dictFind;
dictCopy = __inline__.dictCopy;
dictEq = __inline__.dictEq;
setMake = __inline__.setMake;
setUni = __inline__.setUni;
setInt = __inline__.setInt;
setDif = __inline__.setDif;
vecAdd = __inline__.vecAdd;
vecSub = __inline__.vecSub;
vecDiv = __inline__.vecDiv;
vecMult = __inline__.vecMult;
vecSum = __inline__.vecSum;
vecAvg = __inline__.vecAvg;
vecAvgDir = __inline__.vecAvgDir;
vecLen = __inline__.vecLen;
vecSetLen = __inline__.vecSetLen;
vecNorm = __inline__.vecNorm;
vecRev = __inline__.vecRev;
vecRot = __inline__.vecRot;
vecFromTo = __inline__.vecFromTo;
vecAng = __inline__.vecAng;
vecAng2 = __inline__.vecAng2;
vecDot = __inline__.vecDot;
vecCross = __inline__.vecCross;
vecEqual = __inline__.vecEqual;
vecLtoG = __inline__.vecLtoG;
vecGtoL = __inline__.vecGtoL;
plnMake = __inline__.plnMake;
plnFromRay = __inline__.plnFromRay;
plnCopy = __inline__.plnCopy;
plnMove = __inline__.plnMove;
plnRot = __inline__.plnRot;
plnLMove = __inline__.plnLMove;
plnLRotX = __inline__.plnLRotX;
plnLRotY = __inline__.plnLRotY;
plnLRotZ = __inline__.plnLRotZ;
rayMake = __inline__.rayMake;
rayFromTo = __inline__.rayFromTo;
rayCopy = __inline__.rayCopy;
rayMove = __inline__.rayMove;
rayRot = __inline__.rayRot;
rayLMove = __inline__.rayLMove;
rayFromPln = __inline__.rayFromPln;
rayLtoG = __inline__.rayLtoG;
rayGtoL = __inline__.rayGtoL;
colFalse = __inline__.colFalse;
colScale = __inline__.colScale;
colFromStr = __inline__.colFromStr;
boolean = __inline__.boolean;
number = __inline__.number;
string = __inline__.string;
radToDeg = __inline__.radToDeg;
degToRad = __inline__.degToRad;
numToStr = __inline__.numToStr;
numToCurr = __inline__.numToCurr;
rand = __inline__.rand;
randInt = __inline__.randInt;
randPick = __inline__.randPick;`;
