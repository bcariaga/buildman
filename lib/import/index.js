const   PostmanCollection = require("postman-collection").Collection,
        PostmanItem = require("postman-collection").Item;
const   fs = require('fs');

var root = ""
let write = (readPath, to) => {
    let collection = new PostmanCollection(
        // JSON.parse(fs.readFileSync(`${readPath}/ApiPublica.postman_collection.json`).toString()));
        JSON.parse(fs.readFileSync(readPath).toString()));
        
    root = `${to}/${collection.name}`;

    fs.mkdirSync(root);
    
    //pre y test
    collection.events.each(item => {
        let content = item.script.exec;
        var logger = fs.createWriteStream(`${root}/${item.listen}.js`, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })
        content.map(line => {
            logger.write(line);
            logger.write("\n"); //TODO: no me gusta
        });
        // console.log(`${root}/${item.listen}.js escrito!`);
        // la definition va despues porque tengo que limpiar
        
    })
    let def = {
        name : collection.name,
        description : collection.description ?  collection.description.content : ""
    };
    fs.writeFileSync(`${root}/definition.json`, JSON.stringify(def));

    readItems(collection);
}

let readItems = (collection, path = "") => {
    if (PostmanItem.isItem(collection)) {
        let folderPath = `${path}/${collection.name}`
        // console.log("hay un request!" + collection.name);
        fs.mkdirSync(folderPath);
        collection.events.map(event => { //agrego los eventos (de la carpeta)
            let content = event.script.exec;
            var logger = fs.createWriteStream(`${folderPath}/${event.listen}.js`, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            content.map(line => {
                logger.write(line);
                logger.write("\n"); //TODO: no me gusta
            });
            // console.log(`${folderPath}/${event.listen}.js escrito!`);
        })
        fs.writeFileSync(`${folderPath}/definition.json`, JSON.stringify(collection.request));
        return;
    }
    collection.items.map(itm => {
        let _path = path || `${root}/${itm.name}`;
        if (path === "") {
            fs.mkdirSync(_path);
        }
        itm.events.map(event => { //agrego los eventos (de la carpeta)
            let content = event.script.exec;
            var logger = fs.createWriteStream(`${_path}/${event.listen}.js`, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            content.map(line => {
                logger.write(line);
                logger.write("\n"); //TODO: no me gusta
            });
            // console.log(`${root}/${event.listen}.js escrito!`);
        });
        readItems(itm, _path);

    });
}

/**
 * lee una postman collection y crea un directorio con los datos
 * @param {string} readPath Path donde se encuentra la collection (JSON)
 * @param {string} writePath Path donde se va a escribir la collection
 */
module.exports.importCollection = (readPath, writePath) => write(readPath, writePath);