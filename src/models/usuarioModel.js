var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT 
            id_usuario, 
            nome, 
            email, 
            pontuacao_total, 
            personagem_ideal,
            (SELECT COUNT(*) FROM tentativa_usuario WHERE fk_usuario_id = id_usuario) as qtd_quizzes
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `
        SELECT 
            id_usuario,
            nome,
            email,
            pontuacao_total,
            personagem_ideal,
            (SELECT COUNT(*) FROM tentativa_usuario WHERE fk_usuario_id = id_usuario) as qtd_quizzes
        FROM usuario
        WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha) {
    var instrucaoSql = `INSERT INTO usuario (nome, email, senha, pontuacao_total) VALUES ('${nome}', '${email}', '${senha}', 0);`;
    return database.executar(instrucaoSql);
}

function registrarLeitura(idUsuario, idBallet) {
    var instrucaoSql = `INSERT INTO historico_historias_acessadas (fk_usuario, fk_ballet) VALUES (${idUsuario}, ${idBallet});`;
    return database.executar(instrucaoSql);
}

function registrarQuiz(idUsuario, pontosGanhos) {
    var instrucaoSql = `UPDATE usuario SET pontuacao_total = pontuacao_total + ${pontosGanhos} WHERE id_usuario = ${idUsuario};`;
    // Nota: Para salvar o histórico de tentativas, você precisaria de um INSERT na tabela tentativa_usuario aqui também.
    return database.executar(instrucaoSql);
}

// --- QUERIES PARA OS GRÁFICOS ---

function obterLeituras() {
    var instrucaoSql = `
        SELECT b.titulo as nome_ballet, COUNT(h.id_historico) as total_acessos
        FROM ballets b
        LEFT JOIN historico_historias_acessadas h ON h.fk_ballet = b.id_ballet
        GROUP BY b.titulo;
    `;
    return database.executar(instrucaoSql);
}

function obterCargos() {
    var instrucaoSql = `
        SELECT 
            CASE 
                WHEN pontuacao_total >= 2500 THEN 'Primeira Bailarina'
                WHEN pontuacao_total >= 1200 THEN 'Solista'
                WHEN pontuacao_total >= 500 THEN 'Coryphée'
                WHEN pontuacao_total >= 100 THEN 'Corpo de Baile'
                ELSE 'Estagiária'
            END as cargo,
            COUNT(*) as quantidade
        FROM usuario
        GROUP BY cargo;
    `;
    return database.executar(instrucaoSql);
}

function obterDesempenho(idUsuario) {
    var instrucaoSql = `
        SELECT 
    b.titulo as nome_ballet,
    t.nota as pontuacao
    FROM tentativa_usuario t
    JOIN quizzes q ON t.fk_quiz_id = q.id_quiz
    JOIN ballets b ON q.fk_ballet = b.id_ballet
    WHERE t.fk_usuario_id = ${idUsuario}
    ORDER BY t.data_conclusao DESC
    LIMIT 3;
    `;
    return database.executar(instrucaoSql);
}

function salvarTentativa(idUsuario, idQuiz, nota) {
    var instrucaoSql = `
        INSERT INTO tentativa_usuario (fk_usuario_id, fk_quiz_id, nota) 
        VALUES (${idUsuario}, ${idQuiz}, ${nota});
    `;
    console.log("Executando: " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function salvarPersonagem(idUsuario, personagem) {
    var instrucaoSql = `
        UPDATE usuario SET personagem_ideal = '${personagem}' WHERE id_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function contarQuizzes(idUsuario) {
    var instrucaoSql = `SELECT COUNT(*) as qtd FROM tentativa_usuario WHERE fk_usuario_id = ${idUsuario};`;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    buscarPorId,
    cadastrar,
    registrarLeitura,
    registrarQuiz,
    obterLeituras,
    obterCargos,
    obterDesempenho,
    salvarTentativa,
    salvarPersonagem,
    contarQuizzes
};