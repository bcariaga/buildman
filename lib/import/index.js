const   PostmanCollection = require("postman-collection").Collection,
        PostmanItem = require("postman-collection").Item;
const   fs = require('fs');
const   utils = require('../utils');
//TODO: Logger (en fs?)
var root =""; //TODO: sacar esto
const write = (readPath, to) => {
    //creo la collection
    let collection;
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
    root = `${to}/${collection.name}`;

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
        let writter;
        try {
            //TODO: DRY, pasar a una función
            writter = fs.createWriteStream(filename, {
                flags: 'a'
            });
            item.script.exec.map(line => writter.write(`${line}\n`));
        } catch (error) {
            console.error(`ocurrio un error escribiendo ${filename}`);
            return;
        }finally{
            writter.close();
        }
    })
    //TODO: agregar todos los campos necesarios / buscar una manera automatica de identificarlos
    let def = {
        name : collection.name,
        description : collection.description ?  collection.description.content : ""
    };

    utils.createFile(`${root}/definition.json`, JSON.stringify(def));

    //reviso el contenido de la collection
    readItems(collection);
}

const readItems = (collection, _path = "") => {
    if (PostmanItem.isItem(collection)) {
        let folderPath = `${_path}/${collection.name}`;
        utils.createDir(folderPath);
        collection.events.map(event => { //agrego los eventos (de la carpeta)
            let filename = `${folderPath}/${event.listen}.js`;
            let writter;
            try {
                //TODO: DRY, pasar a una función
                writter = fs.createWriteStream(filename, {
                    flags: 'a'
                })
                event.script.exec.map(line => writter.write(`${line}\n`));
            } catch (error) {
                console.error(`ocurrió un error escribiendo ${filename}`);
                return;
            }finally{
                writter.close();
            }
        });

        utils.createFile(`${folderPath}/definition.json`, JSON.stringify(collection.request));
        return;
    }
    collection.items.map(itm => {
        let _root = _path || `${root}/${itm.name}`;
        
        if (_path === "") {
            utils.createDir(_root);
        }
        itm.events.map(event => { //agrego los eventos (de la carpeta)
            let writter;
            let filename = `${_root}/${event.listen}.js`;
            try {
                writter = fs.createWriteStream(filename, {
                    flags: 'a'
                });
                event.script.exec.map(line => writter.write(`${line}\n`));
            }catch (error) {
                console.error(`ocurrió un error escribiendo ${filename}`);
                return;
            }finally{
                writter.close();
            }
        });
        readItems(itm, _root);
    });
}

/**
 * lee una postman collection y crea un directorio con los datos
 * @param {string} readPath Path donde se encuentra la collection (JSON)
 * @param {string} writePath Path donde se va a escribir la collection
 */
module.exports.importCollection = (readPath, writePath) => write(readPath, writePath);