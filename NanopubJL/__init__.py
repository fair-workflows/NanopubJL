from ._version import __version__ 
from .search import nanopub_search_handler
from notebook.utils import url_path_join

def _jupyter_server_extension_paths():
    return [{
        "module": "NanopubJL"
    }]


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    base_url = url_path_join(web_app.settings['base_url'], 'NanopubJL')
    handlers = [
        nanopub_search_handler(base_url)
    ]
 
    print('Registering handlers:', handlers)
    nb_server_app.log.info("Registering NanopubJL handlers")
    
    web_app.add_handlers('.*$', handlers)

