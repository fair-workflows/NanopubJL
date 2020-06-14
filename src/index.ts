import {
    JupyterFrontEnd,
    JupyterFrontEndPlugin,
    ILayoutRestorer
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { NanopubJLWidget } from './NanopubJLWidget'

/**
 * Initialization data for the NanopubJL extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
    activate,
    id: 'NanopubJL',
    autoStart: true,
    requires: [INotebookTracker, ILayoutRestorer]
};

/**
 * Activate the extension, placing the NanopubJLWidget into the left side bar of Jupyter Lab.
 */
function activate(app: JupyterFrontEnd, tracker: INotebookTracker, restorer: ILayoutRestorer): void {
    console.log('JupyterLab extension NanopubJL is activated!');

    console.log('Loading NanopubJLWidget...');

    const widget = new NanopubJLWidget(tracker);

    restorer.add(widget, widget.id);
    app.shell.add(widget, 'left', { rank: 700});


    console.log('...NanopubJLWidget loaded');
}

export default extension;
