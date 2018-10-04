# Buildman

¡Hola! bienvenido a **buildman**, una herramienta **para trabajar mejor** con Postman.

El objetivo es tener a las **colecciones en un formato mas simple de tratar y controlar**, fuera de un archivo JSON, dándole claridad al código incluido y ¡mejor mantenimiento!.

---

## Indice

1. [Getting started](#getting-started)
    1. [Instalacion](#instalacion)
2. [Uso](#uso)
    1. [Importar](#import)
    2. [Exportar](#export)

---

## Getting started

## Instalacion

```shell
npm install @bcariaga/buildman --global
```

Recomiendo instalarlo global para poder usarlo en cualquier lugar, no solo en un proyecto.

---

## Uso



## Import

Como usar **buildman** crear una _copia_ de tu Postman Collection en archivos.

### Introducción

buildman nació para cubrir esta necesidad, a medida que vamos agregando código a nuestras colecciones de pruebas, vamos subiendo la complejidad de mantenimiento de las mismas y la importancia de tener un código limpio.

A su vez, al usar el editor de postman perdemos algunas facilidades que nos puede dar nuestro IDE favorito, entre otras cosas.

### How To

El primer comando que vamos a tener que usar con buildman va a ser **import**, este comando nos permite crear una estructura de carpetas y archivos con la información de nuestra colección.

Lo unico que necesitamos es una ruta para el destino y una colección de postman :

```shell
buildman import "path/to/collection.json" "path/to/target/folder"
```

Esto va a crear en `path/to/target/folder` una carpeta llamada `collectionName` y dentro de la misma encontraremos una carpeta para cada request, con su respectiva definicion, prescripts y tests. Ademas si dentro de la colección hay carpetas también las veras reflejadas en el directorio.

---

## Export

Como usar **buildman** para crear una Postman Collection.

### Request

**buildman** necesita cierta estructura en las carpetas para poder crear una Postman Collection.

Primero definamos un poco la "estructura" de un request en postman:

Cada request tiene:
+ url
+ method
+ body (depende el method)
+ mas cosas...

Ademas cada request desencadena "eventos":
+ prerequest
+ test

Estos eventos no están atados solo a un request, **si no que por cada nivel de carpetas se pueden definir funciones a ejecutar** cuando se desencadenen. 


Todas estas partes se juntan dentro de un elemento que dentro de una colección se denomina  _"item"_

Entonces una coleccion de postman se conforma de varios _items_ que pueden tener un _request_ u otros items (en ese caso el item es un _itemGroup_ ) y cada item puede tener un _prescript_ y un _test_.


Ahora bien, para que **buildman** entienda todo esto seguiremos el **siguiente esquema**:

```
collection-name
│   definition.json
│   prescript.js
|   test.js   
│
└───Request Group
│   │   prescript.js
│   │   test.js
│   │
│   └───Request one
│       │   definition.json
│       │   prescript.js
│       │   test.js
│   
└───Request two
    │   definition.json
    │   test.js
```

Donde podemos observar que los archivos `definition.json` son **obligatorios** en la raiz del arbol y en cada hoja (en cada carpeta que contenga un request).

Hay diferencias en los definition, para la raiz del directiorio debe ser la definicion de una coleccion de postman, podemos ver el detalle aqui: [definition postman collection](https://www.postmanlabs.com/postman-collection/Collection.html#~definition)

Para los requests la definicion debe ser un json con del siguiente que puede tener la [siguiente definicion](https://www.postmanlabs.com/postman-collection/Request.html#~definition).

Para los js de test y prerequest solo bastara cualquier script (js).

### How to

Una vez tenemos el esquema definido lo único que necesitamos es correr el siguiente comando:

```shell
buildman export "path/to/collection/folder" "path/to/save/collection"
```

y eso nos creara en `path/to/save/collection` un archivo llamado `collectionName.json` totalmente compatible con postman y newman.

---
