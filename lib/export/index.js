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

/**
 * Crea un PostmanItem, valida agrega si exiten los eventos
 * @param {string} name el nombre del PostmanItem (request)
 * @param {string} pre string que indica el path del prescript
 * @param {string} test string que indica el path de los tests 
 */
const createItem = (name, def, pre, test) => {
    let itm = new PostmanItem()
    itm.request = new PostmanRequest(
        JSON.parse(
              fs.readFileSync(def)));
    itm.name = name;
    if (pre)  itm.events.add(createEvent("prerequest", pre));
    if (test) itm.events.add(createEvent("test", test));
    return itm;
}

/**
 * Crea un PostmanItemGroup, valida agrega si exiten los eventos
 * @param {string} name el nombre del PostmanItemGroup (carpeta)
 * @param {string} pre string que indica el path del prescript
 * @param {string} test string que indica el path de los tests 
 */
const createItemGroup = (name, pre, test) => {
    let itmGroup = new PostmanItemGroup();
    itmGroup.name = name;
    if (pre)  itmGroup.events.add(createEvent("prerequest", pre));
    if (test) itmGroup.events.add(createEvent("test", test));

    return itmGroup;
}

/**
 * Revisa recursivamente los archivos enviados creando Items o ItemsGroup segun corresponda
 * @param {object} files objeto que refleja el directorio en manera virtual
 * @param {Array} items array para uso interno (se van agregando los items a devolver)
 */
const createItems = (files, items = []) => {
   
    for(const fileName in files){
        //es una carpeta?
        //es un request o solo una carpeta?
        let isRequest = files[fileName].hasOwnProperty('definition.json');
        let isFolder = typeof(files[fileName]) === "object";
        if (isRequest) {
            items.push(createItem(
                fileName, 
                files[fileName]['definition.json'], 
                files[fileName]['prerequest.js'], 
                files[fileName]['test.js']));

        }else if (isFolder) { //ojo

            let itmGrp = createItemGroup(
                fileName,
                files[fileName]['prerequest.js'], 
                files[fileName]['test.js']);
            // asi no los vuelvo a iterar, no estoy seguro de si es sano.
            delete files[fileName]['prerequest.js'], 
            delete files[fileName]['test.js']

            //aca tengo que iterar de nuevo
            createItems(files[fileName])
                .map(itm => itmGrp.items.append(itm))
            
            items.push(itmGrp);
        }
    }
    
    return items;
}
const build = (files) => {
    
	var collection = new PostmanCollection(
    	JSON.parse(
      		fs.readFileSync(files["definition.json"])));
	
    /*prerequest*/
    if (files["prerequest.js"]) {
        collection.events.add(createEvent("prerequest", files["prerequest.js"]));
        delete files["prerequest.js"];
    }
    /*test*/
    if (files["test.js"]){
        collection.events.add(createEvent("test", files["test.js"]));
        delete files["test.js"];
    }

    createItems(files)
        .map(x => collection.items.add(x));;
    return collection;
}

/**
 * lee un directorio y crea una postman collection
 * @param {string} from raiz del directorio 
 * @param {string} to path donde se deja el collection.json
 */
const exportCollection = (from, to) => {
	var collection = build(
		allFilesSync(from)
    );
    
	try {
        var colPath = `${to}/${collection.name}.json`
        fs.writeFileSync(colPath, JSON.stringify(collection.toJSON()));
    } catch (err) {
        console.error(`ocurrio un error al exportar ${collection.name} (${colPath})`);
        console.log(err);
    }
}

module.exports.exportCollection = exportCollection;