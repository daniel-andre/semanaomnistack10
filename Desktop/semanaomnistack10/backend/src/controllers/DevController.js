const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket');

//index, show, store, update, destroy

module.exports = {
  async index(request, response){
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response){
    const { github_username, techs, latitude, longitude } = request.body;
    
    let dev = await Dev.findOne({github_username});

    if(!dev){
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
      
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      console.log(name, avatar_url, bio, github_username);
    
      const techsArray = parseStringArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    
      let dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      //filtrar as conexoes que estao há no maximo 10 km de distancia e que o novo dev tenha pelo menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        {latitude, longitude},
        techsArray,
      );
      
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  },

  async update(request, response){
    const { username } = request.query;
    const dev = await Dev.findOne({
      github_username: username
    });
    console.log(dev);
    return response.json(dev);
  },

  async destroy(){

  },
}