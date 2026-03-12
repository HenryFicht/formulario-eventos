// api/proxy.js
export default async function handler(req, res) {
  // Configuração de segurança: Permitir apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    // 1. Buscar a URL secreta das variáveis de ambiente do servidor
    const n8nUrl = process.env.N8N_URL;

    if (!n8nUrl) {
      throw new Error('URL do Webhook não configurada no servidor.');
    }

    // 2. Repassar os dados recebidos do formulário para o n8n
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-api-key': process.env.MINHA_CHAVE_SECRETA
      },
      body: JSON.stringify(req.body),
    });

    // 3. Devolver a resposta do n8n para o frontend
    const data = await n8nResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Falha ao conectar com n8n' });
  }
}
