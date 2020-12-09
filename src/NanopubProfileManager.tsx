import * as React from 'react';

/** Properties of the NanopubProfileManager component */
interface INanopubProfileManagerProps {
}

/** State of the NanopubProfileManager component */
interface INanopubProfileManagerState {
    profile_loaded: boolean;
    profile_name: string;
    profile_orcid: string;
}


/**
 * A React Component allowing creation of nanopub profiles (giving author name, orcid, publishing of introductory nanopubs etc)
 * and loading of existing profiles. These profiles are used to author published nanopubs.
 */
export class NanopubProfileManager extends React.Component<INanopubProfileManagerProps, INanopubProfileManagerState> {
    constructor(props: INanopubProfileManagerProps) {
        super(props);
        this.state = {
            profile_loaded: false,
            profile_name: '',
            profile_orcid: ''
        };
    }

    /**
     * Renders the NanopubProfileManager component.
     */
    render(): React.ReactElement {
        console.log('Rendering NanopubProfileManager component')

        return (
            <div className="lm-Widget p-Widget">
                <div className="jp-KeySelector jp-NotebookTools-tool p-Widget lm-Widget" >
                    <header className="jp-RunningSessions-sectionHeader"><h2>Nanopub Profile Manager</h2></header>
                    <p>For authoring nanopubs:</p>
                    <label>
                        <div className="p-Widget jp-DirListing">
                            Name
                            <input type="search" id="textentryname" name="textentryname" value={this.state.profile_name} />
                        </div>
                        <div className="p-Widget jp-DirListing">
                            ORCID
                            <input type="search" id="textentryorcid" name="textentryorcid" value={this.state.profile_orcid} />
                        </div>
                        <div className="p-Widget jp-DirListing">
                            Public RSA key
                            <button type="button"> Make new RSA key </button>
                            <button type="button"> Select existing RSA key </button>
                        </div>
                    </label>
                </div>
            </div>
        );
    }
}
