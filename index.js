#!/usr/bin/env node

const  importCollection = require("./lib/import").importCollection,
        exportCollection = require("./lib/export").exportCollection,
        fs = require('fs')
        CFonts = require('cfonts');

const validateFiles = (paths = []) =>{
    paths.map(path => {
        if (!fs.existsSync(path)) { 
            say(`la ruta ${path} no es valida..`, "yellowBright");
            process.exit(1);
        } 
    })
}
const printInfo = () =>{
    CFonts.say('buildman', {
        font: 'block', 
        align: 'center',
        colors: ['redBright', 'yellowBright'],
        background: 'transparent',
        letterSpacing: 0,
        lineHeight: 1,
        space: true,
        maxLength: '0',
    });
    CFonts.say('buildman v0.1(beta)', {
        font: 'console', 
        align: 'right',
        colors: ['cyan'],
        background: 'transparent',
        letterSpacing: 0,
        lineHeight: 1,
        space: true,
        maxLength: '0',
    });
    // console.info("buildman v0.1(beta) \n");
}

const say = (msg, color = 'system')=>{
    CFonts.say(msg, {
        font: 'console', 
        align: 'left',
        colors: [color],
        background: 'transparent',
        letterSpacing: 0,
        lineHeight: 1,
        space: true,
        maxLength: '0',
    });
}
const program = require('commander');

program
    .command('import <collection> <target>')
    .action(function(collection, target) {
        printInfo();
        validateFiles([collection, target]);
        
        try {
            importCollection(collection, target);
            say("coleccion importada!", "green");
        } catch (error) {
            say("ups! algo se rompio! \n", "red");
            console.log(error);
        }
    })
    .description("lee una postman collection (JSON) y crea una copia en archivos");

program
    .command('export <collection> <target>')
    .action(function(collection, target) {
        printInfo();
        validateFiles([collection, target]);
        
        try {
            exportCollection(collection, target);
            say("coleccion exportada!", "green");
        } catch (error) {
            say("ups! algo se rompio! \n", "red");
            console.log(error);
        }
    })
    .description("lee un directorio y crea una postman collection");

program.version('0.1.0');
program.name("buildman")
program.parse(process.argv);
    
if (program.args.length < 1 ) {
    // console.log(__dirname);
    printInfo();
    try {
        let config = JSON.parse(fs.readFileSync(`${__dirname}/buildman.json`));
        validateFiles([config['collection-folder'], config['destination-path']]);
        exportCollection(config['collection-folder'], config['destination-path']);
        say("coleccion exportada!", "green");
    } catch (error) {
        say("ups! algo se rompio! \n", "red");
        console.log(error);
    }
}
