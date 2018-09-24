# Export

Como usar **buildman** para crear una Postman Collection.

## How to

**buildman** necesita cierta estructura en las carpetas para poder crear una Postman Collection.

Primero definamos un poco la "estructura" de un request en postman:

### Request

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

Para los js de test y prerequest solo bastara cualquier script-