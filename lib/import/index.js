const PostmanCollection = require("postman-collection").Collection,
    PostmanItem = require("postman-collection").Item,
    PostmanItemGroup = require("postman-collection").ItemGroup;
const fs = require('fs');
const utils = require('../utils');

let notify;

const write = (readPath, to) => {
    //creo la collection
   
    var collection;
    try {
        collection = new PostmanCollection(
            JSON.parse(
                fs.readFileSync(
                    readPath)
                .toString()));

    } catch (error) {
        console.error(`No se pudo leer la definición de la collection en ${readPath}`);
        return;
    }
    //defino la raiz de la collection
    var root = `${to}/${collection.name}`;

    //TODO: chequear si existe
    if (fs.existsSync(root)) {
        console.info(`ya existe un directorio en ${root}, sobrescribiendo..`);
        utils.deleteFolderRecursive(root);
    }
    //creo el directorio   
    utils.createDir(root);

    //pre y test
    collection.events.each(item => {
        let filename = `${root}/${item.listen}.js`;
        var writter= fs.createWriteStream(filename, {
            flags: 'a'
        });
        item.script.exec.map(line => writter.write(`${line}\n`));
    })
    //TODO: agregar todos los campos necesarios / buscar una manera automatica de identificarlos
    let def = {
        name: collection.name,
        description: collection.description ? collection.description.content : ""
    };

    utils.createFile(`${root}/definition.json`, JSON.stringify(def));

    createItems(collection, root);
}

const createItems = (collection, root) => {
    //recorro los items
    collection.items.map(itm => {
        if (PostmanItemGroup.isItemGroup(itm))
            createItemGroup(itm, root);
        else
            createRequest(itm, root);
    })

}

/**
 * Crea los items dentro del itemGroup (recursivo)
 * @param {PostmanItem} itm item a recorrer para crear request o carpetas segun corresponda
 * @param {string} path raiz a partir de la cual se van a escribir los items
 */
const createItemGroup = (itm, path) => {
    //creo el path
    let pathToWrite = `${path}/${itm.name}`;
    //creo la carpeta
    utils.createDir(pathToWrite);
    //creo events si corresponde
    itm.events.map(e => createEvent(e, pathToWrite));
    //ver como volver a llamar
    itm.items.map(childItm => {
        if (PostmanItemGroup.isItemGroup(childItm))
            createItemGroup(childItm, pathToWrite);
        else
            createRequest(childItm, pathToWrite);
    })
}

/**
 * Crea un folder con un request dentro
 * @param {PostmanItem} item 
 * @param {string} path raiz a partir del cual se va a escribir el Request
 */
const createRequest = (item, path) => {
    let pathToWrite = `${path}/${item.name}`
    //creo el directorio
    utils.createDir(pathToWrite);
    //creo los eventos
    item.events.map(event => createEvent(event, pathToWrite));
    //creo el request
    utils.createFile(`${pathToWrite}/definition.json`, JSON.stringify(item.request));
}

/**
 * Crea un event en la ruta especificada
 * @param {PostmanEvent} event 
 * @param {string} path raiz a partir del cual se va a escribir el Event
 */
const createEvent = (event, path) => {
    let filename = `${path}/${event.listen}.js`;
    var writter = fs.createWriteStream(filename, {
        flags: 'a'
    })
    event.script.exec.map(line => writter.write(`${line}\n`));
}
/**
 * lee una postman collection y crea un directorio con los datos
 * @param {string} readPath Path donde se encuentra la collection (JSON)
 * @param {string} writePath Path donde se va a escribir la collection
 */
module.exports.importCollection = (readPath, writePath) => write(readPath, writePath);
module.exports.configureEvents = onEvent => notify = onEvent;