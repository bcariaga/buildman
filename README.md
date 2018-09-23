# buildman [beta]
[![Build Status](https://travis-ci.com/bcariaga/buildman.svg?branch=master)](https://travis-ci.com/bcariaga/buildman) 
[![codecov](https://codecov.io/gh/bcariaga/buildman/branch/master/graph/badge.svg)](https://codecov.io/gh/bcariaga/buildman)

A tool for making files from a Postman Collection and vice versa

## Uso:

Actualmente cuenta con dos comandos:

**import** : recibe el path de la collection de postman (JSON) y el target path donde se va a escribir la estructura de carpetas con la info leida de las colleciones.:

`buildman import "path/to/collection.json" "path/to/target/folder"`

**export** : lee un directorio* y crea una coleccion de postman (JSON).

`buildman export "path/to/collection/folder" "path/to/save/collection"`

*el **directorio** debe tener cierto formato (el mismo que se crea al leer una colección), en cada nivel se puede definir un test.js y un prescript.js, en el caso de ser el primer nivel o el utimo se agrega un definition.json, que contiene informacion de la collection como el nombre (y nose que mas) y en el caso del request tiene la url, el tipo de llamada etc...

**Adicionalmente:** Si se llama sin parámetros se va a intentar hacer un export (leer un directorio y crear una postman collection), para que esto funcione la raiz del directorio debe tener un archivo json con el siguiente nombre: `buildman.json` y el siguiente formato:

```json
{
    "collection-folder" : "",
    "destination-path" : ""
}
```
donde *collection-folder* es la raiz donde se encuentra la coleccion de postman (archivos) y *destination-path* es el lugar donde se va a escribir el JSON.

## Instalacion

Por ahora el paquete se queda en este repo, podemos instalarlo con npm:

`npm install git+https://github.com/bcariaga/buildman.git`
