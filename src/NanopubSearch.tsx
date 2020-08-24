import * as React from 'react';
import { debounce } from 'ts-debounce';
import { requestAPI } from './RequestAPI';

/** Properties of the SearchResult component */
interface ISearchResultProps {
    uri: string;
    description: string;
    date: string;
    onClick(np: string): void;
}

/**
 * A React component that renders a single Search Result.
 * Clicking on the component will trigger a call to the onClick()
 * function specified via the ISearchResultProps.
 */
export class SearchResult extends React.Component<ISearchResultProps, {}> {
    onClick = (): void => {
        this.props.onClick(this.props.uri);
    }
    render(): React.ReactElement {
        return (
            <li key={this.props.uri} title={this.props.uri}>
                <span className='jp-DirListing-item' onClick={this.onClick}>
                    <p>{this.props.description}</p>
                    <p>{this.props.date}</p>
                </span>
            </li>
        );
    }
}

/** Properties of the NanopubSearch component */
interface INanopubSearchProps {
    injectCode(injectStr: string): void;
}

/** State of the NanopubSearch component */
interface INanopubSearchState {
    source: 'nanopub';
    searchtext: string;
    results: any;
    loading: boolean;
}


/**
 * A React Component adding ability to search the nanopub servers.
 * Search results are obtained through requests to the extension backend (running the NanopubJL python lib)
 * Search input through the UI is debounced (triggered after 500 ms of inactivity). 
 */
export class NanopubSearch extends React.Component<INanopubSearchProps, INanopubSearchState> {
    debounced_search: ReturnType<typeof debounce>;
    constructor(props: INanopubSearchProps) {
        super(props);
        this.state = {
            source: 'nanopub',
            searchtext: '',
            loading: false, 
            results: []
        };
        
        this.debounced_search = debounce(this.search, 500);
    }

    /**
     * Called when a search result option has been clicked.
     * Prompts the injection of the corresponding python code to a notebook cell.
     */
    onResultClick = (uri: string): void => {
        console.log('User selected:', uri);

        if (this.state.source === 'nanopub') {
            const code = 'from fairworkflows import Nanopub\nnp = Nanopub.fetch(\'' + uri + '\')\nprint(np)';
            this.props.injectCode(code);
        }
    }

    /**
     * Called when the search entry input changes. The searching is debounced,
     * triggering after 500ms of inactivity, following this change. This is to
     * reduce the number of search requests going out, while maintaining a 
     * 'real time' feel to the search.
     */
    onSearchEntry = (event: any): void => {
        this.setState({searchtext: event.target.value});
        this.debounced_search();
    }

    /**
     * Called when the search source is changed
     */
    onSourceChange = (event: any): void => {
        this.setState({ source: event.target.value, results: [], searchtext: '' });
    }

    /**
     * Sends the appropriate search query to the backend, and obtains
     * back the search results.
     */
    search = (): void => {
        console.log('searching:', this.state.searchtext);

        let endpoint = '';
        let queryParams = {};

        if (this.state.source === 'nanopub') {
            endpoint = 'nanosearch';
            queryParams = {type_of_search: 'text', search_str: this.state.searchtext};
        } else {
            console.error('Source is not recognised:\n', this.state.source);
            return;
        }

        this.setState({loading: true});
        requestAPI<any>(endpoint, queryParams)
            .then(data => {
                this.setState({results: data});
                this.setState({loading: false});
            })
            .catch(reason => {
                console.error('Search failed:\n', reason);
                this.setState({loading: false});
            });
    }

    /**
     * Renders the NanopubSearch component. <SearchResult> components are used to display
     * any currently active search results.
     */
    render(): React.ReactElement {
        console.log('Rendering NanopubSearch component')

        // Display the results, or a "Loading..." message
        let searcharea = (<span className="jp-fairwidget-busy">Loading...</span>);
        if (this.state.loading === false) {
            let searchresults = [];
            if (this.state.source === 'nanopub') {
                searchresults = this.state.results.map( (c: any) => (
                    <SearchResult key={c.id} uri={c.np} description={c.description} date={c.date} onClick={this.onResultClick} />
                ));
            }

            searcharea = (<ul className="jp-DirListing-content">{searchresults}</ul>);
        }

        return (
            <div className="lm-Widget p-Widget">
                <div className="jp-KeySelector jp-NotebookTools-tool p-Widget lm-Widget" >
                    <header className="jp-RunningSessions-sectionHeader"><h2>Nanopub Search</h2></header>
                    <label>
                        Source
                        <div className="jp-select-wrapper jp-mod-focused">
                            <select className='jp-mod-styled' value={this.state.source} onChange={this.onSourceChange}>
                                <option key='select_nanopub' value='nanopub'>Nanopub</option>
                            </select>
                        </div>
                    </label>
                    <label>
                        Search
                        <div className="jp-select-wrapper">
                            <input type="search" id="searchentry" name="searchentry" onChange={this.onSearchEntry} value={this.state.searchtext} />
                        </div>
                    </label>
                </div>
                <div className="p-Widget jp-DirListing">
                    {searcharea}
                </div>
            </div>
        );
    }
}
