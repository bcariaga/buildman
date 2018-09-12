const   PostmanCollection = require("postman-collection").Collection,
        PostmanItem = require("postman-collection").Item,
        PostmanItemGroup = require("postman-collection").ItemGroup,
        PostmanEvent = require("postman-collection").Event,
        PostmanRequest = require("postman-collection").Request;

const allFiles = require("../utils/").allFilesSync;

const   fs = require('fs'),
        path = require('path');