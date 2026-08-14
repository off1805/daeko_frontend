export interface HttpClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
}

export class EtablissementApiClient {
  constructor(private readonly config: HttpClientConfig) {}

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.getToken) {
      const token = this.config.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  public async post<T, B>(endpoint: string, body: B): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  public async put<T, B>(endpoint: string, body: B): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
}