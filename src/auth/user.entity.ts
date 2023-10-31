import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TypeAuth } from './enum.TypeAuth';
import { type } from 'os';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') //tự động tạo một unique ID
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // định nghĩa OneToMany relation cho thuộc tính tasks bên trong user.entity
  // sử dụng decorator để cung cấp loại relation
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  // arrow function ( hàm mũi tên ) là 2 tham số cho relation OneToMany
  // (_type)=> Task là tham số của thuộc tính task, đó là loại của thực thể task
  // task => task.user là tham số giúp chúng ta có thể truy cập đến thực thể task khi đang ở user
  // thuộc tính object eager
  tasks: Task[];

  @Column()
  typeAuth: TypeAuth;
}
