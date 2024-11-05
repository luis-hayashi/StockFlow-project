const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public')); // Serve arquivos da pasta "public"

// Configuração do banco de dados
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Cria a tabela de produtos se não existir
db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    preco REAL,
    quantidade INTEGER,
    descricao TEXT,
    montante REAL
)`);

// Rota para registrar um novo produto
app.post('/produtos', (req, res) => {
    const { nome, preco, quantidade, descricao } = req.body;

    const montante = preco * quantidade;

    const verifQuery = 'SELECT * FROM produtos WHERE nome = ?';

    db.get(verifQuery, [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            return res.status(400).json({ message: 'Produto já existe.' });
        } else {
            if (!nome || preco === undefined || quantidade === undefined || descricao === undefined) {
                return res.status(400).json({ error: 'Dados inválidos' });
            }
        
            const query = `INSERT INTO produtos (nome, preco, quantidade, descricao, montante) VALUES (?, ?, ?, ?, ?)`;
            db.run(query, [nome, preco, quantidade, descricao, montante], function (err) {
                if (err) {
                    console.error('Erro ao inserir produto:', err);
                    return res.status(500).json({ error: 'Erro ao salvar o produto' });
                }
                
                res.status(201).json({ message: 'Produto ' + nome + ' registrado com sucesso!', produto: { nome } });
            });
        }
    });
});

app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM produtos';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Retorna todos os produtos
    });
});

app.delete('/deletar/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM produtos WHERE id = ?';

    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes > 0) {
            res.send("Produto deletado.");
        } else {
            res.status(404).send("Produto não encontrado.");
        }
    });
});

app.get('/produto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM produtos WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }
        res.json(row); // Retorna os dados do produto encontrado
    });
});

app.put('/produto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, preco, quantidade, descricao } = req.body;

    // Validação básica
    if (!nome || preco === undefined || quantidade === undefined || descricao === undefined) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    const query = `UPDATE produtos SET nome = ?, preco = ?, quantidade = ?, descricao = ?, montante = ? * preco WHERE id = ?`;
    db.run(query, [nome, preco, quantidade, descricao, quantidade, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Produto atualizado com sucesso." });
    });
});

app.put('/produto/sell/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { quantidade } = req.body;

    if (typeof(id) !== "number" || typeof(quantidade) !== "number") {
        return res.status(400).json({ error: 'Dados inválidos' });
    }


    db.get(`SELECT quantidade FROM produtos WHERE id = ?`, [id], (err, row) => {
        if(err) {
            return res.status(500).send('Erro ao consultar o banco de dados');
        }

        if(!row) {
            return res.status(500).send('Produto não encontrado.');
        }

        if(row) {
            const actualQuantity = parseInt(row.quantidade);
            if(quantidade <= 0) {
                return res.status(500).json({ error: "A quantidade tem que ser maior do que zero." });
            }

            if(actualQuantity >= quantidade) {
                const query = `UPDATE produtos SET quantidade = quantidade - ?, montante = (quantidade - ?) * preco WHERE id = ?`;
                db.run(query, [quantidade, quantidade, id], function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: "Produto vendido com sucesso." });
                })
            }else if(actualQuantity < quantidade){
                return res.status(400).json({ error: "Não há quantidade suficiente no estoque!" });
            }
        }
    })
})  

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});