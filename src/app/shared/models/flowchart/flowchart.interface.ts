//
//
// The flowchart is the basic datastructure in Mobius - it is essentially a linked-list.
// It also
//

import { INode } from '@models/node';
import { IEdge } from '@models/edge';
import { IFunction } from '@models/procedure';
import { Model } from '@design-automation/mobius-sim-funcs';

export interface IFlowchart {
    id: string;
    name: string;
    description: string;
    returnDescription?: string;
    language: string;

    last_updated?: Date;

    nodes: INode[];
    edges: IEdge[];
    functions: IFunction[];
    subFunctions?: IFunction[];
    ordered: boolean;

    model: Model;

    meta: {
        selected_nodes: number[];
    };
}

export const canvasSize = 10000;

