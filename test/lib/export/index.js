const expect = require('chai').expect,
      fs_mock = require('mock-fs'),
      fs = require('fs'),
      PostmanCollection = require('postman-collection').Collection,
      PostmanRequest =  require('postman-collection').Request,
      PostmanItem =  require('postman-collection').Item;

const exportCollection = require('../../../lib/export/').exportCollection;

/**
 * Runs the tests for exportCollection
 */
const run = () => {
    describe('EportCollection', function() {
        beforeEach( function(){
          fs_mock({
            'virtual': {
              'collection' : {
                'great-collection': {
                    "Login":{
                        "definition.json" : JSON.stringify({"method":"POST","header":[{"key":"Content-Type","value":"application/json"}],"body":{"mode":"raw","raw":"{\"email\": \"peter@klaven\",\"password\": \"cityslicka\"}"},"url":{"raw":"https://reqres.in/api/login","protocol":"https","host":["reqres","in"],"path":["api","login"]},"description":"A login request"}),
                        "test.js": 'console.log("this is a prerequest script");'
                    },
                    "Users" : {
                        "Create a User": {
                            "definition.json" : JSON.stringify({"url":{"protocol":"https","path":["api","users"],"host":["reqres","in"],"query":[],"variable":[]},"header":[{"key":"Content-Type","value":"application/json"}],"method":"POST","body":{"mode":"raw","raw":"{\"name\": \"morpheus\",\"job\": \"leader\"}"}}),
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
                            "definition.json" : JSON.stringify({"description":{"content":"get a single user request","type":"text/plain"},"url":{"protocol":"https","path":["api","users","2"],"host":["reqres","in"],"query":[],"variable":[]},"method":"GET","body":{}}),
                            "test.js": 'let res = JSON.parse(responseBody);'+
                            '\n'+
                            'pm.test("is a user with id 2", () =>'+
                            '{'+
                            '    pm.expect(2).to.equal(res.data.id)'+
                            '})'
                        },
                        "Get Users": {
                            "definition.json" : JSON.stringify({"description":{"content":"Get all users in page 2","type":"text/plain"},"url":{"protocol":"https","path":["api","users"],"host":["reqres","in"],"query":[{"key":"page","value":"2"}],"variable":[]},"method":"GET","body":{}}),
                            "test.js": 'let res = JSON.parse(responseBody);'+
                            '\n'+
                            'pm.test("is a page 2", () =>'+
                            '{'+
                            '    pm.expect(2).to.equal(res.page)'+
                            '})'
                        }
                    },
                    "definition.json" : '{"name":"great-collection","description":"A collection for tests on **buildman**"}',
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
    
            let col = new PostmanCollection(
                JSON.parse(
                    fs.readFileSync('virtual/bin/great-collection.json')
                    .toString()));
    
            let isCol = PostmanCollection.isCollection(col);
    
            expect(isCol).to.be.true;
        });
        it('PostmanCollection`s folders must be match by folders', function () {
            exportCollection('virtual/collection/great-collection', 'virtual/bin');
    
            let col = new PostmanCollection(
                JSON.parse(
                    fs.readFileSync('virtual/bin/great-collection.json')
                    .toString()));
            //User`s folder
            let users = col.items.find( itm => itm.name === "Users");
            //Login´s folder
            let login = col.items.find( itm => itm.name === "Login");
    
    
            expect(users).not.be.null;
            expect(users.items.members[0].name).to.be.eq("Create a User");
            expect(users.items.members[1].name).to.be.eq("Get Users");
            expect(users.items.members[2].name).to.be.eq("Get a single user");
            expect(login).not.be.null;
            
            
          
        });
        it('PostmanCollection`s files must be match by files', function () {
            exportCollection('virtual/collection/great-collection', 'virtual/bin');
    
            let col = new PostmanCollection(
                JSON.parse(
                    fs.readFileSync('virtual/bin/great-collection.json')
                    .toString()));
    
            //Requests
            let reqLogin = col.oneDeep("Login");
            let reqCreateUsr= col.oneDeep("Create a User");
            let reqGetUsr= col.oneDeep("Get Users");
            let reqGetSingle= col.oneDeep("Get a single user");
    
            expect(PostmanItem.isItem(reqLogin)).to.be.true;
            expect(PostmanItem.isItem(reqCreateUsr)).to.be.true;
            expect(PostmanItem.isItem(reqGetUsr)).to.be.true;
            expect(PostmanItem.isItem(reqGetSingle)).to.be.true;
            
            expect(reqLogin).to.haveOwnProperty('request');
            expect(reqCreateUsr).to.haveOwnProperty('request');
            expect(reqGetUsr).to.haveOwnProperty('request');
            expect(reqGetSingle).to.haveOwnProperty('request');
    
            expect(reqLogin.request.method).to.be.eq('POST');
            expect(reqCreateUsr.request.method).to.be.eq('POST');
            expect(reqGetUsr.request.method).to.be.eq('GET');
            expect(reqGetSingle.request.method).to.be.eq('GET');
    
        });
      });
}


module.exports.run = run;