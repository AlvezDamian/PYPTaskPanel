# Debugging Prisma + NestJS  

## Error: `TypeError: Cannot read properties of undefined (reading '__internal')`



Este documento contiene **toda la información en un solo archivo**, estructurada y lista para entregar.



---



## 1. Descripción del error



Stack trace observado:





TypeError: Cannot read properties of undefined (reading '__internal')

at new t (.../@prisma/client/src/runtime/getPrismaClient.ts:239:27)

at new PrismaService (.../src/prisma/prisma.service.ts:11:19)



Interpretación profesional:



**NestJS no puede inicializar el `PrismaService` porque el `PrismaClient` está mal importado, mal generado o desincronizado.**  

Prisma intenta acceder a su runtime interno (`__internal`) y falla porque el cliente está corrupto.



---



## 2. Implementación oficial y correcta de PrismaService



Reemplazá cualquier versión previa por la versión recomendada por Prisma + NestJS.



### `src/prisma/prisma.service.ts`



```ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';



@Injectable()

export class PrismaService

  extends PrismaClient

  implements OnModuleInit, OnModuleDestroy

{

  async onModuleInit() {

    await this.$connect();

  }



  async onModuleDestroy() {

    await this.$disconnect();

  }

}



src/prisma/prisma.module.ts

import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';



@Module({

  providers: [PrismaService],

  exports: [PrismaService],

})

export class PrismaModule {}



src/app.module.ts

import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';



@Module({

  imports: [

    PrismaModule,

    // otros módulos

  ],

})

export class AppModule {}



Reglas clave:





PrismaService debe extender PrismaClient.





No usar rutas internas del runtime ni imports alternativos.





No agregar lógica en el constructor.







3. Sincronización de Prisma (causa raíz habitual)

Problema típico: prisma CLI ≠ @prisma/client ≠ runtime generado, lo que rompe internamente propiedades como __internal.

3.1 Revisar versiones:

npx prisma -v



Ambas deben coincidir (misma versión).

3.2 Reinstalar dependencias:

npm install prisma @prisma/client --save-dev

npm install @prisma/client --save



3.3 Regenerar cliente:

npx prisma generate



Si no hacés esto luego de instalar/actualizar, PrismaClient queda corrupto.

3.4 Validar el schema:

generator client {

  provider = "prisma-client-js"

}



datasource db {

  provider = "mysql"

  url      = env("DATABASE_URL")

}



Todo debe estar correctamente definido.



4. Import correcto de PrismaClient

Debe ser:

import { PrismaClient } from '@prisma/client';



Errores que generan exactamente tu fallo:





import { PrismaClient } from '@prisma/client/runtime'





import * as Prisma from '@prisma/client'





Usar un path custom tipo ./generated/prisma/client





Cliente no regenerado después de cambios







5. Compatibilidad con Node.js

El warning:

(Use `node --trace-deprecation ...`)



Indica alguna incompatibilidad.

Prisma recomienda trabajar con Node 18 o Node 20 (LTS).

Si estás usando Node 21+ o 22, probá levantar el proyecto con Node 20.



6. Resultado esperado

Después de:





Aplicar PrismaService canónico





Importar desde @prisma/client





Sincronizar versiones





Ejecutar prisma generate





Usar Node LTS





El error desaparece:

Cannot read properties of undefined (reading '__internal')



La app NestJS debería iniciar correctamente.



7. Cómo explicarlo en un test técnico

Análisis estilo senior:





Identifiqué un fallo al inicializar el provider PrismaService.





Verifiqué la implementación canónica recomendada por Prisma.





Revisé imports y descarté accesos indebidos al runtime interno.





Sincronizé el cliente (prisma + @prisma/client + prisma generate).





Validé la compatibilidad con Node LTS.





Documenté el proceso, la causa raíz y la solución.





Esto demuestra criterio de ingeniería, no dependencia ciega de la IA.



8. Checklist final





 PrismaService oficial (extendiendo PrismaClient)





 Import correcto desde @prisma/client





 Versiones sincronizadas prisma y @prisma/client





 Cliente regenerado (npx prisma generate)





 Node LTS en ejecución





 Sin imports de runtime internos





 Sin lógica extra en el constructor





 schema.prisma válido y consistente







Fin del documento.

