// Service do recurso Auth (/health, /login, /me).
class AuthService {
  constructor(client) {
    this.client = client;
  }

  health() {
    return this.client.get('/health');
  }

  login(credenciais) {
    return this.client.post('/login', credenciais);
  }

  me() {
    return this.client.get('/me');
  }
}

module.exports = AuthService;
