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
      context: ({ req, res }) => {
        console.log('context req.hearders', req.headers)
        const uid = req.headers?.['x-user-uid']
        console.log('context', { uid })
        return { req, res }
      }
    }),
    AuthModule
  ],
})
export class AppModule {}
