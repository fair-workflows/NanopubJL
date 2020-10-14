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
                <div className='jp-DirListing-item' onClick={this.onClick}>
                    <div>
                        <p>{this.props.description}</p>
                        <p>{this.props.date}</p>
                    </div>
                </div>
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
    searchtype: 'text' | 'pattern' | 'things';
    searchtext: string;
    searchthing: string;
    searchsubj: string;
    searchpred: string;
    searchobj: string;
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
            searchtype: 'text',
            searchtext: '',
            searchthing: '',
            searchsubj: '',
            searchpred: '',
            searchobj: '',
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

        const code = 'from nanopub import NanopubClient\nnpclient = NanopubClient()\nnp = npclient.fetch(\'' + uri + '\')\nprint(np)';
        this.props.injectCode(code);
    }

    /**
     * Called when the search text entry input changes. The searching is debounced,
     * triggering after 500ms of inactivity, following this change. This is to
     * reduce the number of search requests going out, while maintaining a 
     * 'real time' feel to the search.
     */
    onSearchTextEntry = (event: any): void => {
        this.setState({searchtext: event.target.value});
        this.debounced_search();
    }

    /**
     * Called when the search 'thing' entry input changes. The searching is debounced,
     * triggering after 500ms of inactivity, following this change. This is to
     * reduce the number of search requests going out, while maintaining a 
     * 'real time' feel to the search.
     */
    onSearchThingEntry = (event: any): void => {
        this.setState({searchthing: event.target.value});
        this.debounced_search();
    }

    /**
     * Called when the search subject entry input changes. The searching is debounced,
     * triggering after 500ms of inactivity, following this change. This is to
     * reduce the number of search requests going out, while maintaining a 
     * 'real time' feel to the search.
     */
    onSearchSubjEntry = (event: any): void => {
        this.setState({searchsubj: event.target.value});
        this.debounced_search();
    }

    /**
     * Called when the search object entry input changes. The searching is debounced,
     * triggering after 500ms of inactivity, following this change. This is to
     * reduce the number of search requests going out, while maintaining a 
     * 'real time' feel to the search.
     */
    onSearchObjEntry = (event: any): void => {
        this.setState({searchobj: event.target.value});
        this.debounced_search();
    }

    /**
     * Called when the search predicate entry input changes. The searching is debounced,
     * triggering after 500ms of inactivity, following this change. This is to
     * reduce the number of search requests going out, while maintaining a 
     * 'real time' feel to the search.
     */
    onSearchPredEntry = (event: any): void => {
        this.setState({searchpred: event.target.value});
        this.debounced_search();
    }

    /**
     * Called when the search type is changed
     */
    onSearchtypeChange = (event: any): void => {
        this.setState({ searchtype: event.target.value, results: [], searchtext: '' });
    }

    /**
     * Sends the appropriate search query to the backend, and obtains
     * back the search results.
     */
    search = (): void => {
        console.log('searching:', this.state.searchtext);

        let endpoint = '';
        let queryParams = {};

        endpoint = 'nanosearch';

        if (this.state.searchtype === 'text') {
            queryParams = {type_of_search: 'text', search_str: this.state.searchtext};
        } else if (this.state.searchtype === 'pattern') {
            queryParams = {type_of_search: 'pattern', subj: this.state.searchsubj, pred: this.state.searchpred, obj: this.state.searchobj};
        } else if (this.state.searchtype === 'things') {
            queryParams = {type_of_search: 'things', thing_type: this.state.searchthing, searchterm: ' '};
        } else {
            console.error('Search type not recognised:\n', this.state.searchtype);
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

            if (this.state.results.length > 0) {
                searchresults = this.state.results.map( (c: any) => (
                    <SearchResult key={c.id} uri={c.np} description={c.description} date={c.date} onClick={this.onResultClick} />
                ));
                searcharea = (<ul className="jp-DirListing-content">{searchresults}</ul>);
            } else {
                searcharea = (<ul className="jp-DirListing-content"><span className='jp-DirListing-item'><p>No results</p></span></ul>);
            }

        }

        let searchentry = null;
        if (this.state.searchtype === 'text') {
            searchentry = (
                <div className="p-Widget jp-DirListing">
                    Text
                    <input type="search" id="searchtextentry" name="searchtextentry" onChange={this.onSearchTextEntry} value={this.state.searchtext} />
                </div>
            );
        } else if (this.state.searchtype === 'pattern') {
            searchentry = (
                <div className="p-Widget jp-DirListing">
                    Subject
                    <input type="search" id="searchsubjentry" name="searchsubjentry" onChange={this.onSearchSubjEntry} value={this.state.searchsubj} />
                    Predicate
                    <input type="search" id="searchpredentry" name="searchpredentry" onChange={this.onSearchPredEntry} value={this.state.searchpred} />
                    Object
                    <input type="search" id="searchobjentry" name="searchobjentry" onChange={this.onSearchObjEntry} value={this.state.searchobj} />
                </div>
            );
        } else if (this.state.searchtype === 'things') {
            searchentry = (
                <div className="p-Widget jp-DirListing">
                    Thing
                    <input type="search" id="searchthingentry" name="searchthingentry" onChange={this.onSearchThingEntry} value={this.state.searchthing} />
                </div>
            );
        } else {
            console.error('Search type not recognised:\n', this.state.searchtype);
        }

        return (
            <div className="lm-Widget p-Widget">
                <div className="jp-KeySelector jp-NotebookTools-tool p-Widget lm-Widget" >
                    <header className="jp-RunningSessions-sectionHeader"><h2>Nanopub Search</h2></header>
                    <label>
                        Search
                        <div className="jp-select-wrapper jp-mod-focused">
                            <select className='jp-mod-styled' value={this.state.searchtype} onChange={this.onSearchtypeChange}>
                                <option key='select_text' value='text'>Text</option>
                                <option key='select_pattern' value='pattern'>Pattern</option>
                                <option key='select_things' value='things'>Things</option>
                            </select>
                        </div>
                    </label>
                    <label>
                        {searchentry}
                    </label>
                </div>
                <br/>
                <div className="p-Widget jp-DirListing">
                    {searcharea}
                </div>
            </div>
        );
    }
}
