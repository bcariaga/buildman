# Buildman

¡Hola! bienvenido a **buildman**, una herramienta **para trabajar mejor** con Postman.

El objetivo es tener a las **colecciones en un formato mas simple de tratar y controlar**, fuera de un archivo JSON, dándole claridad al código incluido y ¡mejor mantenimiento!.

## Getting started

### Instalacion:
```shell
npm install git+https://github.com/bcariaga/buildman.git
```

### Uso:

#### Importar:

Importamos una colección y la transformamos en archivos físicos, para esto usamos el siguiente comando:

```shell
buildman import "path/to/collection.json" "path/to/target/folder"
```

Esto creara en `path/to/target/folder` un nuevo directorio con el nombre de la colección y todos los archivos de la misma.

[Docs Import](import.md)


#### Exportar:

Exportamos un directorio que contiene archivos que componen la colección y lo transformamos en un archivo JSON que postman y newman pueden interpretar (una PostmanCollection):

```shell
buildman export "path/to/collection/folder" "path/to/save/collection"
```
[Docs Export](export.md)
