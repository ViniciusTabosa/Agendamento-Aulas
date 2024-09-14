const Categoria = require('../models/CategoriaAula');

// Criar uma nova categoria
exports.criarCategoria = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const categoriaExistente = await Categoria.findOne({ nome });
    if (categoriaExistente) {
      return res.status(400).json({ error: 'Já existe uma categoria com esse nome' });
    }

    const novaCategoria = new Categoria({ nome, descricao });
    const categoriaSalva = await novaCategoria.save();

    res.status(201).json({ message: 'Categoria criada com sucesso', categoria: categoriaSalva });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria', detalhes: error.message });
  }
};

// Obter todas as categorias
exports.obterCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter categorias' });
  }
};

// Obter categoria por ID
exports.obterCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter categoria' });
  }
};

// Atualizar uma categoria
exports.atualizarCategoria = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const categoriaAtualizada = await Categoria.findByIdAndUpdate(req.params.id, { nome, descricao }, { new: true });

    if (!categoriaAtualizada) return res.status(404).json({ error: 'Categoria não encontrada' });

    res.status(200).json({ message: 'Categoria atualizada com sucesso', categoria: categoriaAtualizada });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar categoria', detalhes: error.message });
  }
};

// Deletar uma categoria
exports.deletarCategoria = async (req, res) => {
  try {
    const categoriaDeletada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaDeletada) return res.status(404).json({ error: 'Categoria não encontrada' });

    res.status(200).json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar categoria', detalhes: error.message });
  }
};

// buscar aulas com filtro para a página de gerenciamento de aulas (admin)
exports.buscarCategoriasComFiltros = async (req, res) => {
  try {
    const { searchQuery, pagina = 1, categoriasPorPagina = 10 } = req.query;

    let query = {};

    // Aplicar filtros de nome e categoria
    if (searchQuery) {
      query.nome = { $regex: searchQuery, $options: "i" };
    }
    
    // Buscar categorias com paginação
    const categorias = await Categoria.find(query)
      .sort({ nome: 1 }) // Ordena por nome
      .skip((pagina - 1) * categoriasPorPagina)
      .limit(parseInt(categoriasPorPagina));

    // Contar o total de aulas para paginação
    const totalCategorias = await Categoria.countDocuments(query);

    res.status(200).json({ categorias, totalCategorias });
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar categorias", detalhes: error.message });
  }
};
