/// <reference types="vite/client" />

// Ampliar la interfaz ImportMeta para incluir la propiedad env
interface ImportMeta {
  readonly env: {
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly [key: string]: any;
  };
}
