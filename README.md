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
