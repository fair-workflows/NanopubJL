import asyncio
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join
import tornado

from urllib.parse import urldefrag

from nanopub import NanopubClient

class NanopubSearchHandler(APIHandler):

    @tornado.web.authenticated
    def get(self):

        client = NanopubClient()

        type_of_search = self.get_argument('type_of_search')

        if type_of_search == 'text':
            search_str = self.get_argument('search_str')
            print('Searching for', search_str)
            results = client.find_nanopubs_with_text(search_str)
        elif type_of_search == 'pattern':
            subj = self.get_argument('subj')
            pred = self.get_argument('pred')
            obj = self.get_argument('obj')
            print('Searching for pattern', subj, pred, obj)
            results = client.find_nanopubs_with_pattern(subj=subj, pred=pred, obj=obj)
        elif type_of_search == 'things':
            thing_type = self.get_argument('thing_type')
            searchterm = self.get_argument('searchterm')
            print('Searching for "thing"', thing_type, searchterm)
            if not searchterm:
                searchterm = ' '
            results = client.find_things(thing_type, searchterm=searchterm)
        else:
            raise ValueError(f'Unrecognized type_of_search, {type_of_search}')

        ret = json.dumps(list(results))
        self.finish(ret)

def nanopub_search_handler(base_url='/'):
    endpoint = url_path_join(base_url, '/nanosearch')
    return endpoint, NanopubSearchHandler
