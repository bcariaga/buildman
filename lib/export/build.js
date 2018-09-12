const   PostmanCollection = require("postman-collection").Collection,
        PostmanItem = require("postman-collection").Item,
        PostmanItemGroup = require("postman-collection").ItemGroup,
        PostmanEvent = require("postman-collection").Event,
        PostmanRequest = require("postman-collection").Request;

const   fs = require('fs'),
        path = require('path');

// const   folderPath = process.env.FOLDER_PATH || './collection';
const   folderPath = process.env.FOLDER_PATH || './import/TI - Buses Api Ventas';

const allFilesSync = (dir, fileList = {}) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);    
        fs.statSync(filePath).isDirectory()
            ? fileList[file] = allFilesSync(filePath)
            : fileList[file] = filePath
    });
    return fileList
}

const build = (files) => {
       
	let collection = new PostmanCollection(
    	JSON.parse(
      		fs.readFileSync(files["definition.json"],)));
	
	/*prerequest*/
    collection.events.add(createEvent("prerequest", files["prerequest.js"]));
    /*test*/
	collection.events.add(createEvent("test", files["test.js"]));
    
	for (const folder in files) {
        if (typeof(files[folder]) === "string") //para saltear las definitions
            continue;

        let itmGroup = new PostmanItemGroup();
        itmGroup.name = folder;
        itmGroup.events.add(createEvent("prerequest", files[folder]["prerequest.js"]));
        itmGroup.events.add(createEvent("test", files[folder]["test.js"]));
        
        delete files[folder]["prerequest.js"];
        delete files[folder]["test.js"];
        for (const req in files[folder]) {
            let itm = new PostmanItem()
            itm.name = req;
            itm.events.add(createEvent("prerequest", files[folder][req]["prerequest.js"]));
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
 * Lee un archivo, y devuelve un array de strings
 * @param {string} path del archivo js
 * @returns {Array.<string>} lineas del archivo
 */
var jsToStrings = (path) => fs.readFileSync(path).toString().split(/\r?\n/);
/**
 * Crea un Evento de Postman
 * @see https://www.postmanlabs.com/postman-collection/Event.html
 * @param {string} listen 
 * @param {string} path 
 */
var createEvent = (listen, path) => {
    let event = new PostmanEvent();
    event.script = jsToStrings(path);
    event.listen = listen;
    return event;
};

/* debug */
var coll = build(allFilesSync(folderPath));
console.log(JSON.stringify(coll));
// console.log(JSON.stringify(allFilesSync(folderPath)));

fs.writeFile(`./build/${coll.name}.json`, JSON.stringify(coll.toJSON()), (err)=>{
    if (err) 
        console.err(err);
    else
        console.log("coleccion exportada!");
});