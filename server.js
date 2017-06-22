var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var path = require('path')
var connect = require('connect')
var serveStatic = require('serve-static')
connect().use(serveStatic(__dirname)).listen(8080, function () {
    console.log('Server running on 8080...')
})