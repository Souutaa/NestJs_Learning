import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/JwtToken/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true, // in nestjs you will have to create entities, và đó là cách mà tụi entities được chuyển qua thành tables/schema thông qua sự trợ giúp của typeorm
      // có thể dùng autoLoadEntities và để cho typeorm tự tìm các file entity và load chúng một cách tự động hoặc
      // bạn cũng có thể tự chọn ra các entity mà bạn muốn load
      synchronize: true,
      // giúp cho các bảng trong database với schema luôn đồng bộ với nhau. Hoặc cũng có thể sử dụng migration
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
