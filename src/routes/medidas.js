// src/routes/medidas.js
var express = require("express");
var router = express.Router();
var medidaController = require("../controllers/medidaController");

router.get("/acessos-ballets", function (req, res) {
    medidaController.buscarAcessosBallets(req, res);
});

router.get("/distribuicao-cargos", function (req, res) {
    medidaController.buscarCargos(req, res);
});

router.get("/desempenho/:idUsuario", function (req, res) {
    medidaController.buscarDesempenho(req, res);
});

module.exports = router;