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
 * @param {string} _path del archivo js
 * @returns {Array.<string>} lineas del archivo
 */
const jsToStrings = (_path) => fs.readFileSync(_path).toString().split(/\r?\n/);

/**
 * Borra un directorio con su contenido
 * @param {string} _path path de la carpeta a borrar (tambien borra los archivos internos)
 */
const deleteFolderRecursive = function(_path) {
  if (fs.existsSync(_path)) {
    fs.readdirSync(_path).forEach(function(file, index){
      var curPath = _path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(_path);
  }
};

/**
 * Crea un directorio en la ubicación indicada (si no existe)
 * @param {string} _path donde se creara el directorio (incluye el nombre del mismo)
 */
const createDir = (_path) => {
    if (!fs.exists(_path)) 
        fs.mkdirSync(_path);
    
}

/**
 * Crea el archivo con el contenido indicado por parámetros 
 * @param {string} _path Lugar donde se va a escribir el archivo (nombre del mismo incluido)
 * @param {string} content Contenido del archivo
 */
const createFile = (_path, content) =>{
    fs.writeFileSync(_path, content);
}

module.exports.allFilesSync = allFilesSync;
module.exports.jsToStrings = jsToStrings;
module.exports.deleteFolderRecursive = deleteFolderRecursive;
module.exports.createDir = createDir;
module.exports.createFile = createFile;