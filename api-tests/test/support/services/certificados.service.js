// Service do recurso Certificados (leitura/upload de PFX).
class CertificadosService {
  constructor(client) {
    this.client = client;
  }

  // Leitura de certificado (multipart na vida real); usado aqui p/ o caminho de validação.
  ler(payload, opts = { headers: { 'Content-Type': 'application/json' } }) {
    return this.client.post('/certificados/ler', payload, opts);
  }
}

module.exports = CertificadosService;
