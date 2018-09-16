const expect = require('chai').expect,
      fs_mock = require('mock-fs'),
      fs = require('fs');

const great_collection = require('../../data/great_collection.js').great_collection;
const importCollection = require('../../../lib/import/').importCollection;
debugger;
/*Configuro el mock*/
// fs_mock({
//   'virtual/collection': {
//     'great-collection.postman_collection.json': JSON.stringify(great_collection()),
//   },
//   'virtual/result': { },
// });

describe('ImportCollection', function() {
  beforeEach(function(){
    fs_mock({
      'virtual': {
        'collection' : {
          'great-collection.postman_collection.json': JSON.stringify(great_collection()),
        },
        'result' : { }
      }
    });
  });
  afterEach(function() {
    fs_mock.restore()
  });
  it('Must be import a collection', function() {
    importCollection('virtual/collection/great-collection.postman_collection.json', 'virtual/result');
    expect(fs.existsSync('virtual/result/great-collection'), 'folder must be exists').to.be.true;
  });
  it('Folders must be match by postmanCollection`s folders', function () {
    importCollection('virtual/collection/great-collection.postman_collection.json', 'virtual/result');
    expect(fs.existsSync('virtual/result/great-collection/Login'), 'folder whit name "Login"  must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users'), 'folder whit name "Users" must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users/Get Users'), 'folder whit name "Get Users" must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users/Get a single user'), 'folder whit name "Get a single user" must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users/Create a User'), 'folder whit name "Create a User" must be exists').to.be.true;
  });
  it('Files must be match by postmanCollection`s Files', function () {
    importCollection('virtual/collection/great-collection.postman_collection.json', 'virtual/result');

    expect(fs.existsSync('virtual/result/great-collection/definition.json'), 'great-collection/definition.json must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/prerequest.js'), '/great-collection/prerequest.js must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/test.js'), '/great-collection/test.js must be exists').to.be.true;

    expect(fs.existsSync('virtual/result/great-collection/Users/Create a User/definition.json'), 'great-collection/Users/Create a User/definition.json must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users/Create a User/test.js'), 'great-collection/Users/Create a User/test.js must be exists').to.be.true;
    
    expect(fs.existsSync('virtual/result/great-collection/Users/Get a single user/definition.json'), 'great-collection/Users/Get a single user/definition.json must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users/Get a single user/test.js'), 'great-collection/Users/Get a single user/test.js must be exists').to.be.true;
    
    expect(fs.existsSync('virtual/result/great-collection/Users/Get Users/definition.json'), 'great-collection/Users/Get Users/definition.json must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Users/Get Users/test.js'), 'great-collection/Users/Get Users/test.js must be exists').to.be.true;

    //TODO: posible bug
    expect(fs.existsSync('virtual/result/great-collection/Login/Login/definition.json'), 'great-collection/Users/Get Users/definition.json must be exists').to.be.true;
    expect(fs.existsSync('virtual/result/great-collection/Login/Login/test.js'), 'great-collection/Users/Get Users/test.js must be exists').to.be.true;

    

  });
});