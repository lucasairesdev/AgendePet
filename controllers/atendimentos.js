const { response } = require('express');
const Atendimento = require('../models/atendimentos')
module.exports = app => {
    app.get('/atendimentos', (require,response) => {
        Atendimento.listaAtendimento(response);
    });

    app.get('/atendimentos/:id', (require, response) =>{
        const id = parseInt(require.params.id);

        Atendimento.buscaPorId(id, response)
    })

    app.post('/atendimentos', (require, response) => {
        const atendimento = require.body

        Atendimento.adicionaAtendimento(atendimento, response)
    })

    app.patch('/atendimentos/:id', (require, response) => {
        const id = parseInt(require.params.id);
        const valores = require.body;

        Atendimento.alteraAtendimento(id,valores,response);
    })

    app.delete('/atendimentos/:id', (require, response) =>{
        const id = parseInt(require.params.id);

        Atendimento.deletaAtendimento(id, response);
    })
}