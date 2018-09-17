const expect = require('chai').expect,
      fs_mock = require('mock-fs'),
      fs = require('fs'),
      postmanCollection = require('postman-collection').Collection;

const great_collection = require('../../data/great_collection.js').great_collection;
const exportCollection = require('../../../lib/export/').exportCollection;

describe('EportCollection', function() {
    beforeEach(function(){
      fs_mock({
        'virtual': {
          'collection' : {
            'great-collection': {
                "Login":{
                    "definition.json" : JSON.stringify('{"name":"great-collection","description":"A collection for tests on **buildman**"}'),
                    "test.js": 'console.log("this is a prerequest script");'
                },
                "Users" : {
                    "Create a User": {
                        "definition.json" : JSON.stringify('{"url":{"protocol":"https","path":["api","users"],"host":["reqres","in"],"query":[],"variable":[]},"header":[{"key":"Content-Type","value":"application/json"}],"method":"POST","body":{"mode":"raw","raw":"{\r\n    \"name\": \"morpheus\",\r\n    \"job\": \"leader\"\r\n}"}}'),
                        "test.js": 'let res = JSON.parse(responseBody);' +
                        '\n' +
                        'pm.test("name from created user is correct", () =>' +
                        '{'+
                        '    pm.expect("morpheus").to.equal(res.name)'+
                        '})'+
                        '\n'+
                        'pm.test("job from created user is correct", () =>'+
                        '{'+
                        '    pm.expect("leader").to.equal(res.job)'+
                        '})'
                    },
                    "Get a single user": {
                        "definition.json" : JSON.stringify('{"description":{"content":"get a single user request","type":"text/plain"},"url":{"protocol":"https","path":["api","users","2"],"host":["reqres","in"],"query":[],"variable":[]},"method":"GET","body":{}}'),
                        "test.js": 'let res = JSON.parse(responseBody);'+
                        '\n'+
                        'pm.test("is a user with id 2", () =>'+
                        '{'+
                        '    pm.expect(2).to.equal(res.data.id)'+
                        '})'
                    },
                    "Get Users": {
                        "definition.json" : JSON.stringify('{"description":{"content":"Get all users in page 2","type":"text/plain"},"url":{"protocol":"https","path":["api","users"],"host":["reqres","in"],"query":[{"key":"page","value":"2"}],"variable":[]},"method":"GET","body":{}}'),
                        "test.js": 'let res = JSON.parse(responseBody);'+
                        '\n'+
                        'pm.test("is a page 2", () =>'+
                        '{'+
                        '    pm.expect(2).to.equal(res.page)'+
                        '})'
                    }
                },
                "definition.json" : JSON.stringify({"name":"great-collection","description":"A collection for tests on **buildman**"}),
                "prerequest.js" : 'console.log("this is a prerequest script");',
                "test.js": 'console.log("this is a test script");'
            },
          },
          'bin' : { }
        }
      });
    });
    afterEach(function() {
      fs_mock.restore()
    });
    it('Must be export a collection', function() {
        exportCollection('virtual/collection/great-collection', 'virtual/bin');
        var isCol = postmanCollection.isCollection(JSON.parse(
            fs.readFileSync('virtual/bin/great-collection.json')));
        console.log(isCol);
        expect(postmanCollection.isCollection(
            JSON.parse(
                fs.readFileSync('virtual/bin/great-collection.json')))).to.be.true;
    });
    it('PostmanCollection`s folders must be match by folders', function () {
       //TODO
    });
    it('postmanCollection`s files must be match by files', function () {
       //TODO
    });
  });