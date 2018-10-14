const expect = require('chai').expect,
      fs_mock = require('mock-fs'),
      fs = require('fs');

const utils = require('../../../lib/utils/');

const run = () => {
    describe("Utils tests", () => {
        beforeEach( () => {
            fs_mock({
              'virtual': {
                'folder one' : {
                  'some file.txt': 'some content from some file',
                },
                'folder two' : { 
                    'folder two sub one' : {
                        'folder two sub one sub one' : {
                            'leaf.txt' : 'hi! i am a small leaf in this freaky folder tree'
                        }
                    }
                }
              }
            });
        });
        afterEach( () => {
            fs_mock.restore()
        });

        it("allFilesSync must be read all files", () => {
            let files = utils.allFilesSync('virtual');
            console.log(files);
            
            expect(files).to.not.be.null;
            expect(files).haveOwnProperty('folder one');
            expect(files['folder one']).haveOwnProperty('some file.txt');
            expect(files['folder one']['some file.txt']).to.be.eq('virtual\\folder one\\some file.txt');
            expect(files).haveOwnProperty('folder two');
        });
        it("createFile must be create a file", () => {
            utils.createFile('virtual/testfile.txt', 'test content');

            expect(fs.existsSync('virtual/testfile.txt')).to.be.true;
            expect(fs.readFileSync('virtual/testfile.txt').toString()).to.be.eql('test content');
        });
        it("deleteFolderRecursive must be delete a folder", () => {
            utils.deleteFolderRecursive('virtual/folder two');

            expect(fs.existsSync('virtual/folder two')).to.be.false;
            expect(fs.existsSync('virtual/folder two/folder two sub one/folder two sub one sub one/leaf.txt')).to.be.false;
        });
        it("createDir must be create a folder", () => {
            utils.createDir('virtual/folder three');
            expect(fs.existsSync('virtual/folder three')).to.be.true;
        });
    });
}

module.exports.run = run;