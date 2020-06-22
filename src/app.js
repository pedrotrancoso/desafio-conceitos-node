const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const parseStringAsArray = require("./utils/parseStringAsArray");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequest(request, response, next){
  const {method, url} = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
} 

function validateProjectId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)) return response.status(400).json({ error: 'Invalid repositorie ID.' });

  return next();
}

app.use(logRequest);
app.use('/repositories/:id', validateProjectId);


app.get('/repositories', (request, response) => {
  const title = request.query;

  const result = title
    ? repositories.filter(repositorie => repositorie.title.includes(title))
    : repositories;

  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  
  const { title, url, techs } = request.body;
  //const numLike = 0;
  
  const techsArray = parseStringAsArray(techs); 

  const repository = { id: uuid(), title, url, techs: techsArray, numLike: 0 };

  repositories.push(repository);
  return response.status(200).json(repository);

});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id == id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repositorie not found.'})
  }

  const techsArray = parseStringAsArray(techs); 

  const repositorie = {
    id,
    title,
    url,
    techs: techsArray
  };

  repositories[repositoryIndex] = repositorie;
  
  return response.json(repositorie);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  
  if(repositorieIndex < 0){
    return response.status(400).json({message: 'Repositorie not found.'})
  }
  
  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repositoryIndex => repositoryIndex.id == id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repositorie not found.'})
  }
    
  repositories[repositoryIndex].numLike += 1;
  
  return response.status(200).json(repositories[repositoryIndex]);
});

//app.listen(3030, () => {
//  console.log('😁 Back-end Started');
//});

module.exports = app;