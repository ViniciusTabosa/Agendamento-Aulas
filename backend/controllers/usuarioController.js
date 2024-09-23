const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Perfil = require('../models/Perfil');
const Agendamento = require('../models/Agendamento')
const sendEmail = require('../utils/sendEmail');

// Criar um novo usuário
exports.criarUsuario = async (req, res) => {
    try {
        const { nome, sobrenome, email, cpf, senha, perfilId } = req.body;

        // Verificação de campos obrigatórios
        if (!nome || !sobrenome || !cpf || !email || !senha || !perfilId) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificação de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Formato de email inválido' });
        }

        // Verificação de CPF único
        const cpfExistente = await Usuario.findOne({ cpf });
        if (cpfExistente) {
            return res.status(400).json({ error: 'CPF já cadastrado' });
        }

        // Verificação de email único
        const emailExistente = await Usuario.findOne({ email });
        if (emailExistente) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Verificação se o perfilId é válido
        const perfilExistente = await Perfil.findById(perfilId);
        if (!perfilExistente) {
            return res.status(400).json({ error: 'Perfil inválido' });
        }

        // Gera o token de confirmação
        const confirmationToken = crypto.randomBytes(20).toString('hex');

        // Cria o usuário com o token de confirmação
        const novoUsuario = new Usuario({
            nome,
            sobrenome,
            cpf,
            email,
            senha,
            perfilId,
            confirmationToken, // Adiciona o token
            isConfirmed: false, // Inicialmente falso
        });

        const usuarioSalvo = await novoUsuario.save();

        // Envia o e-mail de confirmação
        const confirmationUrl = `http://localhost:8080/confirm-account/${confirmationToken}`;
        const message = `Olá, ${nome}. Por favor, confirme sua conta clicando no link: ${confirmationUrl}`;

        await sendEmail({
            email: novoUsuario.email,
            subject: 'Confirmação de Conta',
            message
        });


        res.status(201).json({ message: 'Conta criada com sucesso. Verifique seu e-mail para confirmar.' });
    } catch (error) {
      
        console.log("Erro ao enviar e-mail: ", error.message);
        res.status(500).json({ error: 'Erro ao criar usuário', detalhes: error.message });
    }
};


// Confirmação da conta pelo token
exports.confirmAccount = async (req, res) => {
  try {
      const { token } = req.params;

      // Procura o usuário pelo token de confirmação
      const usuario = await Usuario.findOne({ confirmationToken: token });

      if (!usuario) {
          return res.status(400).json({ error: 'Token inválido.' });
      }

      // Confirma a conta
      usuario.isConfirmed = true;
      usuario.confirmationToken = undefined;

      await usuario.save();

      res.status(200).json({ message: 'Conta confirmada com sucesso!' });
  } catch (error) {
      res.status(500).json({ error: 'Erro ao confirmar conta.' });
  }
};


// Buscar todos os usuários ou filtrar pelo input de busca
exports.buscarUsuarios = async (req, res) => {
  try {
    const { searchQuery, perfilId, pagina = 1, usuariosPorPagina = 15 } = req.query;

    let query = {};

    // Se houver um filtro de busca (nome, sobrenome, cpf, email)
    if (searchQuery) {
      query.$or = [
        { nome: { $regex: searchQuery, $options: "i" } },
        { sobrenome: { $regex: searchQuery, $options: "i" } },
        { cpf: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Se houver um filtro de perfil
    if (perfilId) {
      query.perfilId = perfilId; // Filtro para o perfil selecionado
    }

    // Aplicar o filtro, paginação e ordenar os usuários por nome e sobrenome
    const usuarios = await Usuario.find(query)
      .populate("perfilId")
      .sort({ nome: 1, sobrenome: 1 }) // Ordena em ordem alfabética pelo nome e sobrenome
      .skip((pagina - 1) * usuariosPorPagina)
      .limit(parseInt(usuariosPorPagina));

    // Conta total de usuários (com ou sem filtro)
    const totalUsuarios = await Usuario.countDocuments(query);

    res.status(200).json({ usuarios, totalUsuarios });
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar usuários", detalhes: error.message });
  }
};

// Obter um usuário por ID
exports.obterUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate('perfilId');
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter usuário' });
  }
};

// Obter usuários por perfil (instrutor, administrador, etc.)
exports.obterUsuariosPorPerfil = async (req, res) => {
  try {
    const { role } = req.params; 

    // Buscar o perfil pelo código
    const perfil = await Perfil.findOne({ code: role });
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    // Buscar usuários pelo perfilId
    const usuarios = await Usuario.find({ perfilId: perfil._id });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter usuários' });
  }
};

// Buscar usuário por CPF ou email
exports.buscarUsuarioPorCpfOuEmail = async (req, res) => {
  try {
    const { valor } = req.params;

    // Definir query de busca para CPF ou email
    const query = {
      $or: [
        { cpf: { $regex: valor, $options: 'i' } },
        { email: { $regex: valor, $options: 'i' } },
      ],
    };

    const usuarios = await Usuario.find(query).populate('perfilId');

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Nenhum usuário encontrado' });
    }

    res.status(200).json({ usuarios });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar usuário' });
  }
};

// Deletar um usuário por ID e seus agendamentos relacionados
exports.deletarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Deletar os agendamentos relacionados ao usuário
    await Agendamento.deleteMany({ usuarioId: usuarioId });

    // Deletar o usuário
    await Usuario.findByIdAndDelete(usuarioId);

    res.status(200).json({ message: 'Usuário e seus agendamentos deletados com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário', detalhes: error.message });
  }
};

// Atualizar informações pessoais do usuário (nome e sobrenome)
exports.atualizarInformacoesPessoais = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, email, cpf, perfilId  } = req.body;

    // Buscar o usuário pelo ID
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar nome e sobrenome
    usuario.nome = nome || usuario.nome;
    usuario.sobrenome = sobrenome || usuario.sobrenome;

    if(email){
      usuario.email = email || usuario.email;
    }

    if(cpf){
      usuario.cpf = cpf || usuario.cpf;
    }

    if(perfilId){
      usuario.perfilId = perfilId || usuario.perfilId;
    }

    // Salvar as alterações
    await usuario.save();

    res.status(200).json({ message: 'Informações pessoais atualizadas com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar informações pessoais', detalhes: error.message });
  }
};

// Atualizar senha do usuário
exports.alterarSenha = async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    // Buscar o usuário pelo ID
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se a senha atual está correta
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ error: 'A senha atual está incorreta.' });
    }

    usuario.senha = novaSenha;

    // Salvar as alterações
    await usuario.save();

    res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar senha', detalhes: error.message });
  }
};

// Enviar código de confirmação para alterar o e-mail
exports.enviarCodigoConfirmacaoEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { novoEmail } = req.body;

    // Buscar o usuário pelo ID
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o novo e-mail já está em uso
    const emailExistente = await Usuario.findOne({ email: novoEmail });
    if (emailExistente) {
      return res.status(400).json({ error: 'E-mail já em uso.' });
    }

    // Gerar código de confirmação
    const codigoConfirmacao = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um código de 6 dígitos

    // Salvar o novo e-mail e o código de confirmação no banco de dados
    usuario.novoEmail = novoEmail;
    usuario.codigoConfirmacaoEmail = codigoConfirmacao;
    await usuario.save();

    // Enviar e-mail com o código de confirmação
    const message = `Seu código de confirmação para alterar o e-mail é: ${codigoConfirmacao}`;
    await sendEmail({
      email: novoEmail,
      subject: 'Confirmação de E-mail',
      message,
    });

    res.status(200).json({ message: 'Código de confirmação enviado para o novo e-mail.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar código de confirmação', detalhes: error.message });
  }
};

// Confirmar código de confirmação e atualizar o e-mail
exports.confirmarCodigoEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigoConfirmacao } = req.body;

    // Buscar o usuário pelo ID
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o código de confirmação é válido
    if (usuario.codigoConfirmacaoEmail !== codigoConfirmacao) {
      return res.status(400).json({ error: 'Código de confirmação incorreto.' });
    }

    // Atualizar o e-mail
    usuario.email = usuario.novoEmail;
    usuario.novoEmail = undefined;
    usuario.codigoConfirmacaoEmail = undefined;
    await usuario.save();

    res.status(200).json({ message: 'E-mail atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao confirmar código e atualizar e-mail', detalhes: error.message });
  }
};


