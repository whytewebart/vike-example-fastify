import Minze from "minze";

// indexedDb.ts
type UpgradeCallback = (db: IDBDatabase, transaction: IDBTransaction | null) => void;
type SucessCallback = (db: IDBDatabase) => void;
type ErrorCallback = (error: Error | null) => void;
type FnOpts = {
  onUpgrade?: UpgradeCallback;
  onSuccess?: SucessCallback;
  onError?: ErrorCallback
}

export class IndexedDBWrapper<T = any> {
  private dbName: string;
  private storeName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  private onUpgrade: UpgradeCallback;
  private onSuccess: SucessCallback;
  private onError: ErrorCallback;

  constructor(dbName: string, storeName: string, dbVersion = 1, fn?: FnOpts) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbVersion = dbVersion;

    this.onUpgrade = fn?.onUpgrade || this.defaultUpgrade;
    this.onSuccess = fn?.onSuccess || this.defaultSuccess;
    this.onError = fn?.onError || this.defaultError;
  }

  private defaultUpgrade = (db: IDBDatabase) => {
    if (!db.objectStoreNames.contains(this.storeName)) {
      db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
    }
  };

  private defaultSuccess = (db: IDBDatabase) => {
    this.db = db;
  };

  private defaultError = (error: Error | null) => {
    console.error('IndexedDB error:', error);
  };

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = () => {
        this.onUpgrade(request.result, request.transaction);
      };

      request.onsuccess = async () => {
        this.db = request.result;
        // DISPATH DB
        Minze.dispatch('indexeddb:open', { db: this, store: this.storeName })
        Minze.listen(`indexeddb:${this.storeName}:request`, () => {
          console.log('IndexedDB request for: ', this.dbName)
          Minze.dispatch(`indexeddb:open`, { db: this, store: this.storeName })
        })
        this.onSuccess(request.result);
        resolve();
      };

      request.onerror = () => {
        this.onError(request.error);
        reject(request.error);
      };
    });
  }

  async add(value: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.add(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(id: IDBValidKey): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(value: T, key?: string): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));

      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);

      const request = store.put(value, key); // put updates if key exists, adds if not

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async findByIndex(indexName: string, value: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }


  async delete(id: IDBValidKey): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not opened'));
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
