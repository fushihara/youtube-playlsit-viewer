
/*
./node_modules/@types/node/globals.d.ts
declare namespace NodeJS {
    interface Process extends EventEmitter {
      //ここに追加
    }
  }
*/
import { EventEmitter } from 'events';
declare global {
  namespace NodeJS {
    interface Process extends EventEmitter {
      client: boolean,
      server: boolean,
      static: boolean,
    }
  }
}
