# Nanopub Jupyter Lab Extension

![Github Actions Status](https://github.com/fair-workflows/NanopubJL/workflows/Build/badge.svg)
[![DOI](https://zenodo.org/badge/273529669.svg)](https://zenodo.org/badge/latestdoi/273529669)
[![RSD](https://img.shields.io/badge/RSD-NanopubJL-00aeef)](https://research-software.nl/software/nanopubjl)
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B-yellow)](https://fair-software.eu)

A Jupyterlab extension for searching, fetching and publishing Nanopublications from a python notebook. Uses the [nanopub](https://github.com/fair-workflows/nanopub) python library.

![screenshot](https://github.com/fair-workflows/NanopubJL/blob/master/nanopubJLexample.gif "Screenshot")

This extension is composed of a Python package named `NanopubJL`
for the server extension and a NPM package named `NanopubJL`
for the frontend extension.

## Docker setup
It is possible to run the project inside a docker container. Simply run the following command in the project directory:

```shell script
docker-compose up
```

## Requirements

* JupyterLab >= 3.0

## Install

Note: You will need NodeJS to install the extension.

```bash
pip install NanopubJL
jupyter lab build
```
(The above should be run from the root of the ```NanopubJL``` repository)

## Troubleshoot

If you are seeing the frontend extension but it is not working, check
that the server extension is enabled:

```bash
jupyter serverextension list
```

If the server extension is installed and enabled but you are not seeing
the frontend, check the frontend is installed:

```bash
jupyter labextension list
```

If it is installed, try:

```bash
jupyter lab clean
jupyter lab build
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to NanopubJL directory

# Install server extension
pip install -e .
# Register server extension
jupyter serverextension enable --py NanopubJL

# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

### Uninstall

```bash

pip uninstall FNanopubJL

jupyter labextension uninstall NanopubJL
```
