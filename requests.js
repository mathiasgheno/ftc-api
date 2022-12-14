import axios from 'axios';

const url = 'https://68jb68bukl.execute-api.sa-east-1.amazonaws.com/tasks';

async function buscarTodasTarefas() {
  const dados = await axios.get(url);
  return dados.data;
}

const terefas = await buscarTodasTarefas();

async function buscarTerefasUsuario(usuario) {
  const params = { user: usuario }
  const dados = await axios.get(url, { params });
  return dados.data;
}

const tarefasMathias = await buscarTerefasUsuario('mathias');

async function adicionarTarefa(dto) {
  const dados = await axios.post(url, dto);
  return dados.data;
}

const terefaInserida = await adicionarTarefa({
  description: 'adicionarTerefa',
  user: 'mathiasgheno'
});

async function deletarTerefa(id) {
  const dados = await axios.delete(`${url}/${id}`);
  return dados.data;
}

const terefaDeletada = await deletarTerefa('teste');

async function atualizarTarefa(id, dto) {
  const dados = await axios.put(`${url}/${id}`, dto);
  return dados.data;
}

const terefaAtualizada = await atualizarTarefa('teste', {})
