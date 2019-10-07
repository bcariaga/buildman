# buildman ![version](https://img.shields.io/badge/version-beta-yellowgreen.svg) [![Build Status](https://travis-ci.com/bcariaga/buildman.svg?branch=master)](https://travis-ci.com/bcariaga/buildman) [![codecov](https://codecov.io/gh/bcariaga/buildman/branch/master/graph/badge.svg)](https://codecov.io/gh/bcariaga/buildman) [![GitHub license](https://img.shields.io/github/license/bcariaga/buildman.svg)](https://github.com/bcariaga/buildman/blob/master/LICENSE)



<img src="https://raw.githubusercontent.com/bcariaga/buildman/master/images/logo/png/buildman.png" alt="logo" width="95" style="float: right;"/>
A tool for making files from a Postman Collection and vice versa

---

## Docs:

[https://bcariaga.github.io/buildman/](https://bcariaga.github.io/buildman/)

## Getting Started 

buildman was created on Node.js. To use buildman, you need have [Node.js](https://nodejs.org/es/) installed.

You can install buildman by npm:

`npm install @bcariaga/buildman --global`

_Note: Is recomendly install buildman globally (--global or -g) to can run it anywhere._

---

## Usage

### Import

To **import** a postman´s collection **(create a files and folder)** you need run:

`buildman import "path/to/collection.json" "path/to/target/folder"`

**NOTE:** If the request name contains special chars **(_\/:*?"<>|_)** they be **replace to "-"**. 
Example: postman's folder with name "api/v1" be replace to "api-v1"


### Export

To **export** files and folders to postman´s collection :

`buildman export "path/to/collection/folder" "path/to/save/collection"`

_Note: the files and folders need a especific format, please see the [docs](https://bcariaga.github.io/buildman/)._

If you need more info please visit the docs ([https://bcariaga.github.io/buildman/](https://bcariaga.github.io/buildman/))

### Run

Since v 0.5 buildman can run a single request from postman's collection, using a **run** command.

`buildman run "path/to/request/folder"`

### Debug

:construction: **Experimental** :construction:

That feature allows debug by chrome-devtools, works similarity at _Run_ method:

`buildman debug "path/to/request/folder"`

Note: the debug is attached by flag --inspect-brk, you must use a `debug` statement on test or pre scripts.  

---

### Have problems by buildman?
Please leave a feedback : https://github.com/bcariaga/buildman/issues/new

---

[![NPM](https://nodei.co/npm/@bcariaga/buildman.png?download=true)](https://nodei.co/npm/@bcariaga/buildman/)

---


Logo made by [Freepik](http://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

