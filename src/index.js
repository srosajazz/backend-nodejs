const express = require('express');
const { uuid, isUuid } = require('uuidv4')
const app = express();

app.use(express.json());

const projects = [];

// Middleware

function validateProjectId(request, response, next){
  const { id } = request.params;

if(!isUuid(id)){
  return response.status(400).json({ error: 'Invalid project ID'});
}
return next();

}

function logRequests(request, response, next){
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  // console.log('1');
  console.time(logLabel);
  next();
  // console.log('2');
  console.timeEnd(logLabel);

}


app.use(logRequests);
app.use('/projects/:id', validateProjectId);



app.get('/projects', (request, response) => {
  // console.log('3');
  // Filter
  const { title } = request.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects; 
  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner} = request.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id',(request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }
  const project = { 
    id,
    title,
    owner,
  }
  projects[projectIndex] = project;
  return response.json(project);
});


app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }
  projects.splice(projectIndex, 1);
  return response.status(204).send();
});

app.listen(3334, () => {
  console.log('🚀 Backend started!');
  
});