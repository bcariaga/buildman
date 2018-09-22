const   importCollectionTests = require('./lib/import'),
        exportCollectionTests = require('./lib/export'); 

const runAll = () => {
    importCollectionTests.run();
    exportCollectionTests.run();
}

runAll();
