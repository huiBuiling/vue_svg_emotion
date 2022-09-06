/// <reference types="vite/client" />

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module 'colorpicker-v3'
declare module 'vue-json-pretty'
declare module 'clipboard'
declare module 'html2canvas'
