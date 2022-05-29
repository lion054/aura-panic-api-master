'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
  host: process.env.HOST,
  port: process.env.PORT,
  routes: {
    cors: {
      origin: ['*'] // an array of origins or 'ignore'
    }
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello, world!';
  }
});

const faker = require('faker');
const { cloneDeep } = require('lodash');
const nearby_health = require('./storage/nearby_health.json');
const nearby_security = require('./storage/nearby_security.json');

server.route({
  method: 'POST',
  path: '/nearby_health',
  handler: (request, h) => {
    const payload = typeof request.payload === 'object' ? request.payload : JSON.parse(request.payload);
    const latitude = typeof payload.latitude === 'number' ? payload.latitude : parseFloat(payload.latitude);
    const longitude = typeof payload.longitude === 'number' ? payload.longitude : parseFloat(payload.longitude);
    const result = cloneDeep(nearby_health);
    for (let i = 0; i < result.length; i++) {
      result[i].latitude = faker.datatype.number({
        min: latitude - 0.01,
        max: latitude + 0.01,
        precision: 0.000001
      });
      result[i].longitude = faker.datatype.number({
        min: longitude - 0.01,
        max: longitude + 0.01,
        precision: 0.000001
      });
    }
    return result;
  }
});

server.route({
  method: 'POST',
  path: '/nearby_security',
  handler: (request, h) => {
    console.log(request.payload);
    const payload = typeof request.payload === 'object' ? request.payload : JSON.parse(request.payload);
    const latitude = typeof payload.latitude === 'number' ? payload.latitude : parseFloat(payload.latitude);
    const longitude = typeof payload.longitude === 'number' ? payload.longitude : parseFloat(payload.longitude);
    const result = cloneDeep(nearby_security);
    for (let i = 0; i < result.length; i++) {
      result[i].latitude = faker.datatype.number({
        min: latitude - 0.01,
        max: latitude + 0.01,
        precision: 0.000001
      });
      result[i].longitude = faker.datatype.number({
        min: longitude - 0.01,
        max: longitude + 0.01,
        precision: 0.000001
      });
    }
    return result;
  }
});

server.route({
  method: 'GET',
  path: '/file/{key}',
  handler: (request, h) => {
    const buf = new Buffer(request.params.key, 'base64');
    const filePath = buf.toString('ascii');
    return h.file('.' + filePath);
  }
});

const init = async () => {
  await server.register({
    plugin: require('@hapi/inert')
  });
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', (e) => {
  console.log(e);
  process.exit(1);
});

init();