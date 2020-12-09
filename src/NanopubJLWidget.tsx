import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Widget } from '@lumino/widgets';
import { showErrorMessage } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { CodeCellModel } from '@jupyterlab/cells';
import { NanopubSearch } from './NanopubSearch'
import { NanopubProfileManager } from './NanopubProfileManager'

// setup_profile --orcid_id 'https://orcid.org/0000-0000-0000-0000' --no-publish --name 'test'

/**
 * Widget that lives in the left side bar of Jupyter Lab.
 * The widget can insert python code into cells in the currently selected notebook.
 */
export class NanopubJLWidget extends Widget {
    tracker: INotebookTracker;
    constructor(tracker: INotebookTracker) {
        super();
        this.tracker = tracker;
        this.title.label = 'Nanopub';
        this.title.caption = 'Search and publish nanopublications';
        this.id = 'nanopubjlwidget';
        this.addClass('jp-fairwidget')

        this.update();
    }

    onUpdateRequest(): void {
        console.log('NanopubJLWidget onUpdateRequest()');

        ReactDOM.unmountComponentAtNode(this.node);
        ReactDOM.render(
            <div>
                <NanopubSearch injectCode={this.injectCode} />
                <NanopubProfileManager />
            </div>, this.node);
    }

    injectCode = (injectStr: string): void => {
        if (!this.tracker.currentWidget) {
            showErrorMessage('Cannot inject code into cell without an active notebook', {});
            return;
        }
        const notebook = this.tracker.currentWidget.content;

        const model = notebook.model;
        if (model.readOnly) {
            showErrorMessage('Unable to inject cell into read-only notebook', {});
        }

        const activeCellIndex = notebook.activeCellIndex;
        const cell = new CodeCellModel({
            cell: {
                cell_type: 'code',
                metadata: { trusted: false, collapsed: false, tags: ['Injected by NanopubJL Widget'] },
                source: [injectStr],
            },
        });
        model.cells.insert(activeCellIndex + 1, cell);
        NotebookActions.selectBelow(notebook);
    }
}
