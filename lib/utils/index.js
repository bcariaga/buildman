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

module.exports.allFilesSync = allFilesSync;