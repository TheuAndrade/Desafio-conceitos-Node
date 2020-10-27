const express = require("express");
const cors = require("cors");

const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request,response,next) {
  const {id} = request.parms;
  if(!isUuid(id)){
    return response.state(400).json({error:'ID do not exist'})
  }
  return next()
}

app.use('repositories/:id',validateProjectId)

app.get("/repositories", (request, response) => {
 return response.json(repositories);
  
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body
  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes : 0,
  }
  repositories.push(repository)

  return response.json(repository)
  
});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params
    const {title, url, techs} = request.body

    const repositoryIndex = repositories.findIndex(repository => repository.id === id)
    if(repositoryIndex === -1){
      return response.status(400).json({error:"Repository not found"})
    }
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIndex].likes,
    }
    repositories[repositoryIndex] = repository
    return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
 const {id} = request.params

 const findRepositoryIndex = repositories.findIndex(repository => repository.id === id)
 if(findRepositoryIndex >= 0 ){
   repositories.splice(findRepositoryIndex, 1)
 }else{
   return response.status(400).send()
 }
 return response.status(204).json({Repository:"Does not exist"})
});

app.post("/repositories/:id/like", (request, response) => {
    const {id} = request.params

    const findRepositoryIndex = repositories.findIndex(repository => repository.id === id)
    if(findRepositoryIndex === -1){
      return response.status(400).json({error:"Repository not found"})
    }
    repositories[findRepositoryIndex].likes++;
    return response.json(repositories[findRepositoryIndex])
});

module.exports = app;
