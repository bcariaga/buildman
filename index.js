#!/usr/bin/env node

const   Spinner = require('cli-spinner').Spinner,
        importCollection = require("./lib/import").importCollection,
        exportCollection = require("./lib/export").exportCollection,
        fs = require('fs');

const validateFiles = (paths = []) =>{
    paths.map(path => {
        if (!fs.existsSync(path)) { 
            console.log(`la ruta ${path} no es valida..`);
            process.exit(1);
        } 
    })
}
const printInfo = () =>{
    console.log("Hola! gracias por usar buildman! \n");
}

const program = require('commander');

program
    .command('import <collection> <target>')
    .action(function(collection, target) {
        printInfo();
        console.log(collection);
        console.log(target);
        let spinner = new Spinner(`Importando ${collection} `);
        validateFiles([collection, target]);
        spinner.setSpinnerString(18);
        spinner.start();
        try {
            importCollection(collection, target);
            console.log("coleccion importada!");
            
        } catch (error) {
            console.log("ups! algo se rompio! \n");
            console.log(error);
        }finally{
            spinner.stop(true)
        }
    })
    .description("lee una postman collection (JSON) y crea una copia en archivos");

program
    .command('export <collection> <target>')
    .action(function(collection, target) {
        printInfo();
        let spinner = new Spinner(`Exportando ${collection} `);
        validateFiles([collection, target]);
        spinner.setSpinnerString(18);
        spinner.start();
        try {
            exportCollection(collection, target);
            console.log("coleccion exportada!");
        } catch (error) {
            console.log("ups! algo se rompio! \n");
            console.log(error);
        }finally{
            spinner.stop(true)
        }
    })
    .description("lee un directorio y crea una postman collection");

program.version('0.1.0');
program.name("buildman")
program.parse(process.argv);
    
if (program.args.length < 1 ) {
    // console.log(__dirname);
    let config;
    try {
        config = JSON.parse(fs.readFileSync(`${__dirname}/buildman.json`));
        validateFiles([config['collection-folder'], config['destination-path']]);
        console.log(config['collection-folder']);
        console.log(config['destination-path']);
        
        exportCollection(config['collection-folder'], config['destination-path']);
    } catch (error) {
        console.log("ups!");
        console.error(error);
    }
}
