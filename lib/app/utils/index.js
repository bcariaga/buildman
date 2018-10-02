const fs = require('fs'),
    CFonts = require('cfonts')
    configuration = require('../../../package.json');

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


const say =
    (
        msg,
        color = 'system',
        opt = {
            font: 'console',
            align: 'left',
            colors: [color],
            background: 'transparent',
            letterSpacing: 0,
            lineHeight: 1,
            space: false,
            maxLength: '0',
        }
    ) => CFonts.say(msg, opt);

/**
 * muestra por pantalla un texto (usando CFonts)
 * @param {string} msg texto a mostrar en pantalla
 * @param {string} color color del texto
 * @param {object} opt CFonts options
 */
module.exports.say = say;

/**
 * Saludo!
 */
module.exports.welcome = () => {
    say(
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
    version();

}


const version = () => {
    say(
        `${configuration.name} v ${configuration.version}`, 
        null, 
        {
            font: 'console', 
            align: 'right',
            colors: ['cyan'],
            background: 'transparent',
            letterSpacing: 0,
            lineHeight: 1,
            space: true,
            maxLength: '0',
        }
    );
}

/**
 * Printea la version actual (lee el package.json)
 */
module.exports.version = version;
