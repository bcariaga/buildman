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

program
    .option("-q, --quiet", "silent output");


program
    .command('import <collection> <target>')
    .action(function(collection, target) {
        preCommand(collection, target);
        try {
            importCollection(collection, target);
            utils.say(`coleccion importada en ${target}`, messageColors.success);
        } catch (error) {
            utils.say(`ups! algo se rompio! \n`, messageColors.danger);
            // console.log(error);
        }
    })
    .description("lee una postman collection (JSON) y crea una copia en archivos");

program
    .command('export <collection> <target>')
    .action(function(collection, target) {
        if(program.quiet) utils.say("quiet", messageColors.info);
        
        try {
            exportCollection(collection, target);
            utils.say(`coleccion exportada en ${target}`, messageColors.success);
        } catch (error) {
            utils.say(`ups! algo se rompio! \n`, messageColors.danger);
            //console.log(error);
        }
    })
    .description("lee un directorio y crea una postman collection");

program.version(utils.version);
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
