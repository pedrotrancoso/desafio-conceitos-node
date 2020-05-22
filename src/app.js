const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

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

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repositorie ID.' })
  };

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
  
  const { title, url } = request.body;
  const numLike = 0;
  const repositorie = { id: uuid(), title, url, numLike };

  repositories.push(repositorie);
  return response.status(200).json(repositorie);

});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  
  if(repositorieIndex < 0){
    return response.status(400).json({message: 'Repositorie not found.'})
  }

  const repositorie = {
    id,
    title,
    url
  };

  repositories[repositorieIndex] = repositorie;
  
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
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id, 
    repositorie.numLike += 1);
  
  if(repositorieIndex < 0){
    return response.status(400).json({message: 'Repositorie not found.'})
  }
  const numLike = numLike + 1;

  const repositorie = {
    id,
    title,
    url,
    numLike
  };

  repositories[repositorieIndex] = repositorie;
  
  return response.json(repositorie);
});

app.listen(3030, () => {
  console.log('😁 Back-end Started');
});

module.exports = app;