export class Cache {
  private static store = new Map<string, { value: any; expiry: number }>();

  /**
   * Armazena um valor no cache.
   * @param key Chave única para o item.
   * @param value O valor a ser armazenado.
   * @param ttlMs Tempo de vida em milissegundos (padrão: 1 hora).
   */
  static set(key: string, value: any, ttlMs: number = 3600000) {
    const expiry = Date.now() + ttlMs;
    this.store.set(key, { value, expiry });
  }

  /**
   * Recupera um valor do cache se ainda for válido.
   */
  static get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * Remove manualmente um item.
   */
  static delete(key: string) {
    this.store.delete(key);
  }
}
