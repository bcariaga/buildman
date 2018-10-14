const fs = require('fs'),
    CFonts = require('cfonts'),
    chalk = require('chalk'),
    log = console.log,
    request = require('request'),
    configuration = require('../../../package.json'),
    custom = require('../../../buildman.json');

/**
 * 
 * @param {string[]} paths paths a validar
 * @param {function} validateFn callback con los resultados de la validación
 */
module.exports.validateFiles = (paths = [], validateFn) => {
    const validationResults = [];

    paths.map(path => {
        if (!fs.existsSync(path))
            validationResults.push({
                valid : false,
                message : `path not exists ${path}`
            });
        else
            validationResults.push({
                valid : true,
                message : `path correct ${path}`
            });
    });

    validateFn(validationResults);
}


const sayCFonts =
    (
        msg,
        color = 'system',
        opt = {
            font: 'console',
            align: 'left',
            colors: [color],
            background: 'transparent',
            letterSpacing: 0,
            lineHeight: 0,
            space: false,
            maxLength: '0',
        }
    ) => CFonts.say(msg, opt);

const say = (msg , color) =>
    log(chalk[color](msg));

/**
 * muestra por pantalla un texto (usando chalk)
 * @param {string} msg texto a mostrar en pantalla
 * @param {string} color color del texto
 * @param {object} opt CFonts options
 */
module.exports.say = say;

/**
 * Saludo!
 */
module.exports.welcome = () => {
    sayCFonts(
        'buildman', 
        null, 
        {
            font: 'block', 
            align: 'center',
            colors: ['redBright', 'yellowBright'],
            background: 'transparent',
            letterSpacing: 0,
            lineHeight: 1,
            space: true,
            maxLength: '0',
        }
    );
    //version();

}

const checkVersion = () => {
    // if (custom["check-updates"]) {
        request('https://raw.githubusercontent.com/bcariaga/buildman/master/package.json', function (error, response, body) {
            if (error) throw error
            let currConf = JSON.parse(body);
            if (currConf.version !== configuration.version) 
                log(chalk.yellow.inverse(`a new version is available (${currConf.version})`) + chalk.bold(` please run:`) + chalk.bgMagenta(`\nnpm update buildman`));
            else 
                say(`buildman is up to date`, 'blue');
        });
    // }
}
module.exports.checkVersion = checkVersion;

const version = () => chalk.blueBright(`${configuration.name} ${configuration.version}`);


/**
 * Printea la version actual (lee el package.json)
 */
module.exports.version = version;
