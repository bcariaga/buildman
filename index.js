#!/usr/bin/env node

const program = require('commander');

program
  .version('0.1.0')
  .option('-i, --import <collection>', 'Import a Postman Collection from JSON', (col) => {
      console.log("importando collection... " + col);
      
  })
  .option('-e, --export <path>', 'Export a from file system to Postman Collection (JSON)', (path) => {
      console.log("exportando coleccion " + path);
      
  })
  .parse(process.argv)
  .name("buildman");