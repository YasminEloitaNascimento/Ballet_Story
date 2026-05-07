var express = require("express");
var router = express.Router();
var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", (req, res) => usuarioController.cadastrar(req, res));
router.post("/autenticar", (req, res) => usuarioController.autenticar(req, res));
router.post("/registrarLeitura", (req, res) => usuarioController.registrarLeitura(req, res));
router.post("/registrarQuiz", (req, res) => usuarioController.registrarQuiz(req, res));
router.post("/salvarPersonagem", function (req, res) {
    usuarioController.salvarPersonagem(req, res);
});

// Endpoints dos Gráficos
router.get("/obterDadosGrafico", (req, res) => usuarioController.obterDadosGrafico(req, res));
router.get("/obterDadosCargos", (req, res) => usuarioController.obterDadosCargos(req, res));
router.get("/obterDadosDesempenho/:idUsuario", (req, res) => usuarioController.obterDadosDesempenho(req, res));
router.get("/buscarPorId/:idUsuario", (req, res) => usuarioController.buscarPorId(req, res));

module.exports = router;