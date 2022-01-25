// import @angular stuff
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';
import { ColorPickerModule } from 'ngx-color-picker';

import { CytoscapeViewerComponent } from './cytoscape-viewer.component';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { CytoscapeService } from './service/cytoscape.service';

// import other modules
// import app components
// import { AttributeComponent } from './attribute/attribute.component';
// import { ATabComponent } from './attribute/tab.component';
// import { ATabsComponent } from './attribute/tabs.component';


/**
 * GICesiumViewer
 * A viewer for Geo-Info models.
 */
@NgModule({
    declarations: [
        CytoscapeViewerComponent,
        CytoscapeComponent
    ],
    exports: [
        CytoscapeViewerComponent
    ],
    imports: [
        CommonModule,
        AngularSplitModule,
        MatSliderModule,
        MatIconModule,
        MatExpansionModule,
        MatTooltipModule,
        FormsModule,
        ColorPickerModule
    ],
    providers: [
        CytoscapeService
    ]
})
export class CytoscapeViewerModule {
     static forRoot(): ModuleWithProviders<CytoscapeViewerModule> {
        return {
            ngModule: CytoscapeViewerModule
        };
    }
}
