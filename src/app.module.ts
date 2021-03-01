import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    GraphQLFederationModule.forRoot({
      buildSchemaOptions: {
        numberScalarMode: 'integer',
        orphanedTypes: [User],
      },
      autoSchemaFile: 'schema.graphql',
      // authorize cookies to be send
      cors: {
        credentials: true,
        origin: 'http://localhost:3000'
      },
      context: ({ req, res }) => ({ req, res })
    }),
    AuthModule
  ],
})
export class AppModule {}
