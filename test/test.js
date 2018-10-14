const   importCollectionTests = require('./lib/import'),
        exportCollectionTests = require('./lib/export'),
        utilsTests = require('./lib/utils'); 

const runAll = () => {
    importCollectionTests.run();
    exportCollectionTests.run();
    utilsTests.run();
}

runAll();
