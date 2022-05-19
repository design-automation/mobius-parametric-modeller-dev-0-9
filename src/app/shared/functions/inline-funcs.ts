
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
    'XZ'
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
    'strPadL(s1, m)',
    'strPadR(s1, m)',
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
    'listJoin(list1, list2)',
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
    'distanceM(c1, c2)',
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
`PI = __inline__.constants.PI;
XY = __inline__.constants.XY;
YZ = __inline__.constants.YZ;
ZX = __inline__.constants.ZX;
YX = __inline__.constants.YX;
ZY = __inline__.constants.ZY;
XZ = __inline__.constants.XZ;
VX = __inline__.constants.VX;
VY = __inline__.constants.VY;
VZ = __inline__.constants.VZ;
RX = __inline__.constants.RX;
RY = __inline__.constants.RY;
RZ = __inline__.constants.RZ;
VO = __inline__.constants.VO;
isNum = __inline__.types.isNum;
isInt = __inline__.types.isInt;
isFlt = __inline__.types.isFlt;
isBool = __inline__.types.isBool;
isStr = __inline__.types.isStr;
isList = __inline__.types.isList;
isDict = __inline__.types.isDict;
isVec2 = __inline__.types.isVec2;
isVec3 = __inline__.types.isVec3;
isCol = __inline__.types.isCol;
isRay = __inline__.types.isRay;
isPln = __inline__.types.isPln;
isNaN = __inline__.types.isNaN;
isNull = __inline__.types.isNull;
isUndef = __inline__.types.isUndef;
strRepl = __inline__.strs.strRepl;
strUpp = __inline__.strs.strUpp;
strLow = __inline__.strs.strLow;
strTrim = __inline__.strs.strTrim;
strTrimR = __inline__.strs.strTrimR;
strTrimL = __inline__.strs.strTrimL;
strSub = __inline__.strs.strSub;
strStarts = __inline__.strs.strStarts;
strEnds = __inline__.strs.strEnds;
strPadL = __inline__.strs.strPadL;
strPadR = __inline__.strs.strPadR;
strToJSON = __inline__.strs.strToJSON;
sin = __inline__.trigonometry.sin;
asin = __inline__.trigonometry.asin;
sinh = __inline__.trigonometry.sinh;
asinh = __inline__.trigonometry.asinh;
cos = __inline__.trigonometry.cos;
acos = __inline__.trigonometry.acos;
cosh = __inline__.trigonometry.cosh;
acosh = __inline__.trigonometry.acosh;
tan = __inline__.trigonometry.tan;
atan = __inline__.trigonometry.atan;
tanh = __inline__.trigonometry.tanh;
atanh = __inline__.trigonometry.atanh;
atan2 = __inline__.trigonometry.atan2;
min = __inline__.statistics.min;
max = __inline__.statistics.max;
mad = __inline__.statistics.mad;
mean = __inline__.statistics.mean;
median = __inline__.statistics.median;
mode = __inline__.statistics.mode;
std = __inline__.statistics.std;
vari = __inline__.statistics.vari;
abs = __inline__.arithmetic.abs;
square = __inline__.arithmetic.square;
cube = __inline__.arithmetic.cube;
pow = __inline__.arithmetic.pow;
sqrt = __inline__.arithmetic.sqrt;
exp = __inline__.arithmetic.exp;
log = __inline__.arithmetic.log;
log10 = __inline__.arithmetic.log10;
round = __inline__.arithmetic.round;
sigFig = __inline__.arithmetic.sigFig;
ceil = __inline__.arithmetic.ceil;
floor = __inline__.arithmetic.floor;
sum = __inline__.arithmetic.sum;
prod = __inline__.arithmetic.prod;
hypot = __inline__.arithmetic.hypot;
norm = __inline__.arithmetic.norm;
isApprox = __inline__.arithmetic.isApprox;
isIn = __inline__.arithmetic.isIn;
isWithin = __inline__.arithmetic.isWithin;
remap = __inline__.arithmetic.remap;
distance = __inline__.geometry.distance;
distanceM = __inline__.geometry.distanceM;
distanceMS = __inline__.geometry.distanceMS;
intersect = __inline__.geometry.intersect;
project = __inline__.geometry.project;
range = __inline__.list.range;
len = __inline__.common.len;
listCount = __inline__.list.listCount;
listCopy = __inline__.list.listCopy;
listRep = __inline__.list.listRep;
listLast = __inline__.list.listLast;
listGet = __inline__.list.listGet;
listFind = __inline__.list.listFind;
listHas = __inline__.list.listHas;
listJoin = __inline__.list.listJoin;
listFlat = __inline__.list.listFlat;
listRot = __inline__.list.listRot;
listSlice = __inline__.list.listSlice;
listRev = __inline__.list.listRev;
listCull = __inline__.list.listCull;
listSort = __inline__.list.listSort;
listZip = __inline__.list.listZip;
listEq = __inline__.list.listEq;
dictGet = __inline__.dict.dictGet;
dictKeys = __inline__.dict.dictKeys;
dictVals = __inline__.dict.dictVals;
dictHasKey = __inline__.dict.dictHasKey;
dictHasVal = __inline__.dict.dictHasVal;
dictFind = __inline__.dict.dictFind;
dictCopy = __inline__.dict.dictCopy;
dictEq = __inline__.dict.dictEq;
setMake = __inline__.set.setMake;
setUni = __inline__.set.setUni;
setInt = __inline__.set.setInt;
setDif = __inline__.set.setDif;
vecAdd = __inline__.vec.vecAdd;
vecSub = __inline__.vec.vecSub;
vecDiv = __inline__.vec.vecDiv;
vecMult = __inline__.vec.vecMult;
vecSum = __inline__.vec.vecSum;
vecAvg = __inline__.vec.vecAvg;
vecAvgDir = __inline__.vec.vecAvgDir;
vecLen = __inline__.vec.vecLen;
vecSetLen = __inline__.vec.vecSetLen;
vecNorm = __inline__.vec.vecNorm;
vecRev = __inline__.vec.vecRev;
vecRot = __inline__.vec.vecRot;
vecFromTo = __inline__.vec.vecFromTo;
vecAng = __inline__.vec.vecAng;
vecAng2 = __inline__.vec.vecAng2;
vecDot = __inline__.vec.vecDot;
vecCross = __inline__.vec.vecCross;
vecEqual = __inline__.vec.vecEqual;
vecLtoG = __inline__.vec.vecLtoG;
vecGtoL = __inline__.vec.vecGtoL;
plnMake = __inline__.plane.plnMake;
plnCopy = __inline__.plane.plnCopy;
plnMove = __inline__.plane.plnMove;
plnRot = __inline__.plane.plnRot;
plnLMove = __inline__.plane.plnLMove;
plnLRotX = __inline__.plane.plnLRotX;
plnLRotY = __inline__.plane.plnLRotY;
plnLRotZ = __inline__.plane.plnLRotZ;
rayMake = __inline__.ray.rayMake;
rayFromTo = __inline__.ray.rayFromTo;
rayCopy = __inline__.ray.rayCopy;
rayMove = __inline__.ray.rayMove;
rayRot = __inline__.ray.rayRot;
rayLMove = __inline__.ray.rayLMove;
rayFromPln = __inline__.ray.rayFromPln;
rayLtoG = __inline__.ray.rayLtoG;
rayGtoL = __inline__.ray.rayGtoL;
colFalse = __inline__.colors.colFalse;
colScale = __inline__.colors.colScale;
colFromStr = __inline__.colors.colFromStr;
boolean = __inline__.conversion.boolean;
number = __inline__.conversion.number;
string = __inline__.conversion.string;
radToDeg = __inline__.conversion.radToDeg;
degToRad = __inline__.conversion.degToRad;
numToStr = __inline__.conversion.numToStr;
numToCurr = __inline__.conversion.numToCurr;
rand = __inline__.rand.rand;
randInt = __inline__.rand.randInt;
randPick = __inline__.rand.randPick;`;
