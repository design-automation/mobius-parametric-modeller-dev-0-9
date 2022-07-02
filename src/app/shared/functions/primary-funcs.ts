const list = [
    'Add',
    'Remove',
    'Replace',
    'Sort',
    'Splice',
];

const dict = [
    'Add',
    'Remove',
    'Replace',
];

const query = [
    'Get',
    'Filter',
    'Invert',
    'Sort',
    'Perimeter',
    'Neighbor',
    'Edge',
    'Type',
];

const pattern = [
    'Line',
    'Linear',
    'Rectangle',
    'Grid',
    'Box',
    'Polyhedron',
    'Arc',
    'Bezier',
    'Nurbs',
    'Interpolate',
];

const make = [
    'Position',
    'Point',
    'Polyline',
    'Polygon',
    'Loft',
    'Extrude',
    'Sweep',
    'Join',
    'Cut',
    'Copy',
    'Clone',
];

const modify = [
    'Move',
    'Rotate',
    'Scale',
    'Mirror',
    'XForm',
    'Offset',
    'Remesh',
];

const edit = [
    'Divide',
    'Hole',
    'Weld',
    'Fuse',
    'Ring',
    'Shift',
    'Reverse',
    'Delete',
];

const attrib = [
    'Set',
    'Get',
    'Add',
    'Delete',
    'Rename',
    'Push',
    'Values',
    'Discover',
];

const collection = [
    'Create',
    'Get',
    'Add',
    'Remove',
    'Delete',
];

const analyze = [
    'Raytrace',
    'Isovist',
    'Visibility',
    'View',
    'Sky',
    'Sun',
    'Irradiance',
    'NoiseCRTN',
    'Wind',
    'SkyDome',
    'Nearest',
    'ShortestPath',
    'ClosestPath',
    'Degree',
    'Centrality',
];

const calc = [
    'Distance',
    'Length',
    'Area',
    'Vector',
    'Centroid',
    'Normal',
    'Eval',
    'Ray',
    'Plane',
    'BBox',
];

const visualize = [
    'Color',
    'Gradient',
    'Edge',
    'Mesh',
    'Ray',
    'Plane',
    'BBox',
];

const material = [
    'Set',
    'LineMat',
    'MeshMat',
    'Glass',
    'Lambert',
    'Phong',
    'Standard',
    'Physical',
];

const intersect = [
    'RayFace',
    'PlaneEdge',
];

const poly2d = [
    'Voronoi',
    'Delaunay',
    'ConvexHull',
    'BBoxPolygon',
    'Union',
    'Boolean',
    'OffsetMitre',
    'OffsetChamfer',
    'OffsetRound',
    'Stitch',
    'Clean',
    'Relationship'
];

const io = [
    'Read',
    'Write',
    'Import',
    'Export',
    'Geolocate',
    'Geoalign',
    'LatLong2XYZ',
];

const util = [
    'Select',
    'VrHotspot',
    'VrPanorama',
    'Text',
    'ParamInfo',
    'EntityInfo',
    'ModelInfo',
    'ModelCheck',
    'ModelCompare',
    'ModelMerge',
    'SendData',
    'HTTPRequest',
];

export const primary_func: [string, string[]][] = [
    ['list', list],
    ['dict', dict],
    ['query', query],
    ['pattern', pattern],
    ['make', make],
    ['modify', modify],
    ['edit', edit],
    ['attrib', attrib],
    ['collection', collection],
    ['analyze', analyze],
    ['calc', calc],
    ['visualize', visualize],
    ['material', material],
    ['intersect', intersect],
    ['poly2d', poly2d],
    ['io', io],
    ['util', util],
];