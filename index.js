#!/usr/bin/env node

const   importCollection = require("./lib/import").importCollection,
        exportCollection = require("./lib/export").exportCollection,
        utils = require('./lib/app/utils');

const messageColors = 
{
    success : "green",
    warning : "yellow",
    danger : "red",
    info : "cyan"
}

const program = require('commander');
const preCommand = (collection, target) =>{
    utils.welcome();
    utils.validateFiles([collection, target], validationRules => {
        validationRules.map(rule => {
            if (!rule.valid) utils.say(`opa! ${rule.message}`, messageColors.danger);
        });
        if (validationRules.some(rule => !rule.valid)) process.exit(1); 
    })
}
const getLogFn = (level = "normal", quiet = false) => {
    //TODO:
    // if (quiet) {
    //     return (event) => {
    //         if (event.level < 0) {
    //             utils.say(event.msg, event.status);
    //         }
    //     }
    // }

    // let filterFn = (evt) => evt.level < 3;


    // switch (level) {
    //     case "crazy":
    //         filterFn = (evt) => true;
    //         break;
    //     case "hard":
    //         filterFn = (evt) => evt.level < 5;
    //         break;
    //     case "normal":
    //         break;
    //     default:
    //         utils.say(`loglevel no reconocido ${level}`, messageColors.warning);
    //         break;
    // }
    let filterFn = (evt) => evt.level < 3;
    return (event) => {
        if (filterFn(event)) {
            utils.say(event.msg, messageColors[event.status]);
        }
    }

}

//para manejar el verbosity
program
    .option("--loglevel [level]", "output level [crazy | hard | normal ]")
    .option("-q, --quiet", "silent output (show only errors)");

program
    .command('import <collection> <target>')
    .option("--loglevel [level]", "output level [crazy | hard | normal ]")
    .option("-q, --quiet", "silent output (show only errors)")
    .action(function(collection, target) {
        preCommand(collection, target);
        try {
            importCollection(collection, target);
            utils.say(`coleccion importada en ${target}`, messageColors.success);
        } catch (error) {
            utils.say(`ups! algo se rompio! \n`, messageColors.danger);
        }
    })
    .description("lee una postman collection (JSON) y crea una copia en archivos");

program
    .command('export <collection> <target>')
    .option("--loglevel [level]", "output level [crazy | hard | normal ]")
    .option("-q, --quiet", "silent output (show only errors)")
    .action(function(collection, target) {
        preCommand(collection, target);
        exportCollection(collection, target, getLogFn(program.loglevel, program.quiet));
    })
    .description("lee un directorio y crea una postman collection");

program.version(utils.version, '-v, --version');
program.name("buildman");
program.parse(process.argv);
    
if (program.args.length < 1 ) {
    
    try {
        const fs = require('fs');
        let config = JSON.parse(fs.readFileSync(`${__dirname}/buildman.json`));
        preCommand(config['collection-folder'], config['destination-path']);
        exportCollection(config['collection-folder'], config['destination-path']);
        utils.say(`coleccion importada en ${config['collection-folder']}`, messageColors.success);
    } catch (error) {
        utils.say(`ups! algo se rompio! \n`, messageColors.danger);
        console.log(error);
    }
}
