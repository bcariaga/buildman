const   fs = require('fs'),
        path = require('path');
/**
 * lee un directorio y devuelve un objeto con los archivos leidos y sus paths
 * @param {string} dir path del directorio a leer
 * @param {object} fileList lista de archivos bla bla..
 */
const allFilesSync = (dir, fileList = {}) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);    
        fs.statSync(filePath).isDirectory()
            ? fileList[file] = allFilesSync(filePath)
            : fileList[file] = filePath
    });
    return fileList
}
/**
 * Lee un archivo, y devuelve un array de strings
 * @param {string} path del archivo js
 * @returns {Array.<string>} lineas del archivo
 */
const jsToStrings = (path) => fs.readFileSync(path).toString().split(/\r?\n/);

/**
 * Borra un directorio con su contenido
 * @param {strin} path path de la carpeta a borrar (tambien borra los archivos internos)
 */
const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

/**
 * Crea un directorio en la ubicación indicada
 * @param {string} path donde se creara el directorio (incluye el nombre del mismo)
 */
const createDir = (path) => {
    try {
        fs.mkdirSync(path);
    } catch (dirError) {
        console.error(`Ocurrió un error al escribir el directorio ${path}`);
        process.exit(1);
    }
}

/**
 * Crea el archivo con el contenido indicado por parámetros 
 * @param {string} path Lugar donde se va a escribir el archivo (nombre del mismo incluido)
 * @param {string} content Contenido del archivo
 */
const createFile = (path, content) =>{
    try {
        fs.writeFileSync(path, content);
    } catch (writeFileError) {
        console.error(`Ocurrio un error al escribir el archivo ${path}`);
        process.exit(1);
    }
}

module.exports.allFilesSync = allFilesSync;
module.exports.jsToStrings = jsToStrings;
module.exports.deleteFolderRecursive = deleteFolderRecursive;
module.exports.createDir = createDir;
module.exports.createFile = createFile;