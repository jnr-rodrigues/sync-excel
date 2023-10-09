const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuração de middleware e do servidor
app.use(express.static(__dirname)); // Configura o servidor para servir arquivos estáticos na pasta atual
app.use(express.urlencoded({ extended: true })); // Configura o servidor para lidar com dados codificados de formulário
app.use(express.json()); // Configura o servidor para lidar com dados no formato JSON

const excelFileName = 'plans/dados.xlsx';

function lerExcel() {
  const workbook = xlsx.readFile(excelFileName);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(worksheet);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get('/dados', (req, res) => {
  const data = lerExcel();
  res.json(data);
});

fs.watch(excelFileName, (event) => {
  if (event === 'change') {
    const data = lerExcel();
    io.emit('atualizar-dados', data);
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  const data = lerExcel();
  socket.emit('dados-iniciais', data);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
