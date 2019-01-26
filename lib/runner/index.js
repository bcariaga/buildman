const BuildmanRunner = require('./runner').BuildmanRunner;
const chalk = require('chalk');

run = new BuildmanRunner();
run.on("error", (error) => {
    console.log(chalk.red(error));
});
run.on("before", (item) => {
    console.log(chalk.magenta(`Info Request:`));

    console.log(chalk.cyan(`▶   ${item.name || item.description}`));
});
run.on("start", () => {
    console.log(chalk.blue(`Iniciando Request... \n`));

});
run.on("request", (request) => {
    console.log(chalk.cyan(`෴   ${request.method}: `) + request.url);
});
run.on("response", (response) => {
    if (response.status != 200) {
        console.log(chalk.cyan(`෴   status: `) + response.code);
    }else{
        console.log(chalk.yellow(`෴   status:`) + response.code);
    }
    console.log(chalk.cyan(`෴   time: `) + response.responseTime);
    console.log(chalk.cyan(`\n`));

});
run.on("assertion-error", (assertions) => {
    assertions.map(assert => {
        console.log(chalk.red(`✖ `) + assert.name);
        console.log(chalk.red(`⟿    ${assert.error.name}: ${assert.error.message}`));
    })
});
// run.on("assertions", (assertions) => {
//     assertions.map(assert => {
//         console.log(chalk.white(`⇒`) + assert.name + '\n');
//     })
// });
run.on("assertion-passed", (assertions) => {
    assertions.map(assert => {
        console.log(chalk.green(`✔ `) + assert.name + '\n');
    })
});
run.on("assertion-skipped", (assertions) => {
    assertions.map(assert => {
        console.log(chalk.yellow(`skipeado! ${assert.name} \n`));
    })
});
run.on("done", () => {

});
run.on("log", (log) => {
    console.log('logs: ' + chalk.gray(log));
});
run.on("test", () => {
    console.log(chalk.magenta(`Tests: `));

});

module.exports.runner = function(path, environment){
    run.run(path, environment);
    // run.run('cosas\\great-collection\\Users\\Get Users');
}