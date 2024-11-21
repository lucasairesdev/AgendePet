const express = require("express");
const conexao = require("../infraestrutura/conexao");
const moment = require("moment");

class Atendimento {
  adicionaAtendimento(atendimento, response) {
    const dataCriacao = moment().format("YYYY-MM-DD HH:MM:SS");
    const data = moment(atendimento.data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:MM:SS"
    );

    const dataValida = moment(data).isSameOrAfter(dataCriacao);
    const clienteValido = atendimento.cliente.length >= 5;

    const validacoes = [
      {
        nome: "data",
        valido: dataValida,
        mensagem: "A data tem que ser igual ou maior que a data atual.",
      },
      {
        nome: "cliente",
        valido: clienteValido,
        mensagem: "O nome do cliente precisa ter 5 ou mais caracteres",
      },
    ];

    const erros = validacoes.filter((campo) => !campo.valido);
    const existeErro = erros.length;

    if (existeErro) {
      response.status(400).json(erros);
    } else {
        
      const atendimentoDatado = { ...atendimento, dataCriacao, data };
      const sql = "INSERT INTO Atendimentos SET ?";

      conexao.query(sql, atendimentoDatado, (erro, resultados) => {
        if (erro) {
          response.status(400).json(erro);
        } else {
          response.status(201).json(atendimento);
        }
      });
    }
  }

  listaAtendimento(response) {
    const sql = 'SELECT * FROM Atendimentos'

    conexao.query(sql, (erro, resultados) => {
      if(erro){
        response.status(400).json(erro)
      } else {
        response.status(200).json(resultados)
      }
    })
  }

  buscaPorId(id, response){
    const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

    conexao.query(sql, (erro, resultados) => {
      const atendimento = resultados[0];
      if(erro){
        response.status(400).json(erro);
      } else {
        response.status(200).json(atendimento);
      }
    })
  }

  alteraAtendimento(id, valores, response){
    if(valores.data){
      valores.data = moment(valores.data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:MM:SS");
    }
     const sql = 'UPDATE Atendimentos SET ? WHERE id= ?'

     conexao.query(sql, [valores, id], (erro, resultados) => {
      if(erro){
        response.status(400).json(erro);
      } else{
        response.status(200).json({...valores, id});
      }
     })
  }

  deletaAtendimento(id, response){
    const sql = 'DELETE FROM Atendimentos WHERE id=?'

    conexao.query(sql, id, (erro, resultados)=>{
      if(erro) {
        response.status(400).json(erro);
      }else {
        response.status(200).json({id});
      }
    })
  }
}

module.exports = new Atendimento();
