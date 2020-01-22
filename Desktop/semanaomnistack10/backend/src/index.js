const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:d@784569350@cluster0-ifp8s.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

//Metodos http: get, post, put, delete

//tipos de parametros:

//query params: request.query(filtors, ordenacao, paginacao)
//routes params: request.params (identificar um recurso na alteraco ou remocao) 
//body: request.body (dados para criacao ou alteracao de um registro)

//mongodb (não relacional)

server.listen(3333);