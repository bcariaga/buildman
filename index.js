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
            if (!rule.valid) utils.say(`${getTimeStamp()} # Error: ${rule.message}`, messageColors.danger);
        });
        if (validationRules.some(rule => !rule.valid)) process.exit(1); 
    })
}
const getTimeStamp = (date = new Date()) => `(${date.toLocaleTimeString()}:${date.getMilliseconds()})`;
const printPrettyMessage = (message) => utils.say(`${getTimeStamp()} # ${message.msg}`, messageColors[message.status]); //ojo!

const getLogFn = (level = "normal", quiet = false) => {
    if (quiet) 
        return (event) => {
            if (event.level < 0) //solo errores
                printPrettyMessage(event);
        }

    let filterFn = (evt) => evt.level < 3;

    switch (level.toLocaleLowerCase()) {
        case "c":
        case "crazy":
            filterFn = (evt) => true;
            break;
        case "h":
        case "hard":
            filterFn = (evt) => evt.level < 5;
            break;
        case "n":
        case "normal":
            break;
        default:
            utils.say(`loglevel no reconocido (${level})`, messageColors.warning);
            break;
    }
    return (event) => {
        if (filterFn(event)) 
            printPrettyMessage(event);
        
    }

}

program
    .command('import <collection> <target>')
    .option("-l, --loglevel [level]", "output level [(c)razy | (n)ormal{default} | (h)ard]")
    .option("-q, --quiet", "silent output (show only errors)")
    .action(function(collection, target, options) {
        preCommand(collection, target);
        importCollection(collection, target, getLogFn(options.loglevel, options.quiet));
    })
    .description("lee una postman collection (JSON) y crea una copia en archivos");

program
    .command('export <collection> <target>')
    .option("-l, --loglevel [level]", "output level [(c)razy | (n)ormal{default} | (h)ard]")
    .option("-q, --quiet", "silent output (show only errors)")
    .action(function(collection, target, options) {
        preCommand(collection, target);
        exportCollection(collection, target, getLogFn(options.loglevel, options.quiet));
    })
    .description("lee un directorio y crea una postman collection");

program.version(utils.version(), '-v, --version');
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
