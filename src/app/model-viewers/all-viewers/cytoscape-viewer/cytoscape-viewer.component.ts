// import @angular stuff
import { Component, Input} from '@angular/core';

// import app services
import cytoscape from 'cytoscape';
import { GIModel} from '@design-automation/mobius-sim';

// import others

/**
 * GICesiumViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'cytoscape-viewer',
    templateUrl: './cytoscape-viewer.component.html',
    styleUrls: ['./cytoscape-viewer.component.scss'],
})
export class CytoscapeViewerComponent  {
    // model data passed to the viewer
    @Input() data: GIModel;
    @Input() nodeIndex: number;
    public modelData: GIModel;
    protected cytoscape: cytoscape.Core;

    /**
     * constructor
     * @param dataService
     */
    constructor() {
    }

}
