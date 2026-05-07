var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {
                console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);

                if (resultadoAutenticar.length == 1) {
                    
                    res.json({
                        id: resultadoAutenticar[0].id_usuario,
                        nome: resultadoAutenticar[0].nome,
                        email: resultadoAutenticar[0].email,
                        pontuacao_total: resultadoAutenticar[0].pontuacao_total,
                        personagem_ideal: resultadoAutenticar[0].personagem_ideal,
                        qtd_quizzes: resultadoAutenticar[0].qtd_quizzes 
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarPorId(req, res) {
    var idUsuario = req.params.idUsuario;

    if (!idUsuario || idUsuario == "undefined") {
        return res.status(400).send("ID do usuário inválido!");
    }

    usuarioModel.buscarPorId(idUsuario)
        .then(function (resultado) {
            if (resultado.length == 1) {
                res.json({
                    id: resultado[0].id_usuario,
                    nome: resultado[0].nome,
                    email: resultado[0].email,
                    pontuacao_total: resultado[0].pontuacao_total,
                    personagem_ideal: resultado[0].personagem_ideal,
                    qtd_quizzes: resultado[0].qtd_quizzes
                });
            } else {
                res.status(404).send("Usuário não encontrado!");
            }
        })
        .catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    usuarioModel.cadastrar(nome, email, senha)
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function registrarLeitura(req, res) {
    usuarioModel.registrarLeitura(req.body.idUsuarioServer, req.body.idBalletServer)
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function registrarQuiz(req, res) {
    
    var idUsuarioServer = req.body.idUsuarioServer;
    var pontosServer = req.body.pontosServer;
    
   // contagem de ponto - cada ponto é multiplicado por 20
    var notaFinal = Number(pontosServer) / 20;

    
    console.log("ID recebido do Front-end:", idUsuarioServer);
    console.log("Pontos recebidos do Front-end:", pontosServer);

    //verificação se o ID existe 
    if (!idUsuarioServer || idUsuarioServer == "undefined") {
        console.log("ERRO: O idUsuarioServer chegou como undefined!");
        res.status(400).send("Seu ID de usuário está undefined!");
    } else {
        usuarioModel.registrarQuiz(idUsuarioServer, pontosServer)
            .then(function (resultado) {
                return usuarioModel.salvarTentativa(idUsuarioServer, 1, notaFinal);
            })
            .then(function (resultadoFinal) {
                res.status(201).json(resultadoFinal);
            })
            .catch(function (erro) {
                console.log("Erro no Controller registrarQuiz:", erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

// --- FUNÇÕES DOS GRÁFICOS ---

function obterDadosGrafico(req, res) {
    usuarioModel.obterLeituras().then(resultado => {
        res.status(200).json(resultado);
    }).catch(erro => res.status(500).json(erro.sqlMessage));
}

function obterDadosCargos(req, res) {
    usuarioModel.obterCargos().then(resultado => {
        res.status(200).json(resultado);
    }).catch(erro => res.status(500).json(erro.sqlMessage));
}

function obterDadosDesempenho(req, res) {
    var idUsuario = req.params.idUsuario;

    // Mudamos de obterDesempenho para obterDesempenhoSimples
    usuarioModel.obterDesempenho(idUsuario)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum dado encontrado");
            }
        }).catch(erro => {
            res.status(500).json(erro.sqlMessage);
        });
}

function salvarPersonagem(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var personagem = req.body.personagemServer;

    usuarioModel.salvarPersonagem(idUsuario, personagem)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    buscarPorId,
    cadastrar,
    registrarLeitura,
    registrarQuiz,
    obterDadosGrafico,
    obterDadosCargos,
    obterDadosDesempenho,
    salvarPersonagem
};