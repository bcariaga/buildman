# Import

Como usar **buildman** crear una _copia_ de tu Postman Collection en archivos.

## Introducción:

 buildman nació para cubrir esta necesidad, a medida que vamos agregando código a nuestras colecciones de pruebas, vamos subiendo la complejidad de mantenimiento de las mismas y la importancia de tener un código limpio.

 A su vez, al usar el editor de postman perdemos algunas facilidades que nos puede dar nuestro IDE favorito, entre otras cosas.

 ## Getting Started

 El primer comando que vamos a tener que usar con buildman va a ser **import**, este comando nos permite crear una estructura de carpetas y archivos con la información de nuestra colección.

Lo unico que necesitamos es una ruta para el destino y una colección de postman :

`buildman import "path/to/collection.json" "path/to/target/folder"`

Esto va a crear en `path/to/target/folder` una carpeta llamada `collectionName` y dentro de la misma encontraremos una carpeta para cada request, con su respectiva definicion, prescripts y tests. Ademas si dentro de la colección hay carpetas también las veras reflejadas en el directorio.
