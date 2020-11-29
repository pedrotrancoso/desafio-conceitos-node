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

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.status(200).json(repository);

});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repositorie not found.'})
  }

  let likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;
  
  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repositorie not found.'});
  }else{
    repositories.splice(repositoryIndex, 1);
  }
  
  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repositorie not found.'});
  }else{
    repositories[repositoryIndex].likes ++;
  }
  
  return response.json(repositories[repositoryIndex]);
});

//app.listen(3030, () => {
//  console.log('?? Back-end Started');
//});

module.exports = app;