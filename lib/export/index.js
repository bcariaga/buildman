const   PostmanCollection = require("postman-collection").Collection,
        PostmanItem = require("postman-collection").Item,
        PostmanItemGroup = require("postman-collection").ItemGroup,
        PostmanEvent = require("postman-collection").Event,
        PostmanRequest = require("postman-collection").Request;

const 	allFilesSync = require("../utils/").allFilesSync,
		jsToStrings = require("../utils/index").jsToStrings;

const   fs = require('fs');

/**
 * Crea un Evento de Postman
 * @see https://www.postmanlabs.com/postman-collection/Event.html
 * @param {string} listen 
 * @param {string} path 
 */
const createEvent = (listen, path) => {
	let event = new PostmanEvent();
	event.script = jsToStrings(path);
	event.listen = listen;
	return event;
};


const build = (files) => {

    //TODO: cuantos niveles se banca?
	let collection = new PostmanCollection(
    	JSON.parse(
      		fs.readFileSync(files["definition.json"])));
	
    /*prerequest*/
    if (files["prerequest.js"]) 
        collection.events.add(createEvent("prerequest", files["prerequest.js"]));
    /*test*/
    if (files["test.js"])
        collection.events.add(createEvent("test", files["test.js"]));
    
	for (const folder in files) {
        if (typeof(files[folder]) === "string") //para saltear las definitions
            continue;

        let itmGroup = new PostmanItemGroup();
        itmGroup.name = folder;
        //choto pero tengo que validar si existe
        if (files[folder]["prerequest.js"]){
            itmGroup.events.add(createEvent("prerequest", files[folder]["prerequest.js"]));
            delete files[folder]["prerequest.js"];
        } 

        if (files[folder]["test.js"]){
            itmGroup.events.add(createEvent("test", files[folder]["test.js"]));
            delete files[folder]["test.js"];
        }
        //Bug: si el request esta en fuera de una carpeta no lo toma bien
        for (const req in files[folder]) {
            if (typeof(files[folder][req]) === "string") //para saltear las definitions (ya estan escritas arriba)
                continue;

            let itm = new PostmanItem()
            itm.name = req;
            if (files[folder][req]["prerequest.js"])
                itm.events.add(createEvent("prerequest", files[folder][req]["prerequest.js"]));
            if (files[folder][req]["test.js"])
                itm.events.add(createEvent("test", files[folder][req]["test.js"]));

            itm.request = new PostmanRequest(
                JSON.parse(
                      fs.readFileSync(files[folder][req]["definition.json"])));
            itmGroup.items.add(itm);
        }
        collection.items.add(itmGroup);
	}

	return collection;
}

/**
 * lee un directorio y crea una postman collection
 * @param {string} from raiz del directorio 
 * @param {string} to path donde se deja el collection.json
 */
const exportCollection = (from, to) => {
	let collection = build(
		allFilesSync(from)
	);
	try {
        fs.writeFileSync(`${to}/${collection.name}.json`, JSON.stringify(collection.toJSON()));
        console.log(`se exporto la colecion ${collection.name} en ${to}/${collection.name}.json`);
    } catch (error) {
        console.error(`ocurrio un error al exportar ${collection.name}`);
        process.exit(1);
    }
}

module.exports.exportCollection = exportCollection;