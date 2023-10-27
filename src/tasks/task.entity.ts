import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status-enum';

@Entity()
export class Task {
  // cần nói với TyBorum là id là khoá/cột chính
  @PrimaryGeneratedColumn('uuid') // sử dụng decorator này sẽ tự động tạo ID cho task của chúng ta và xem đây là cột chính
  // sử dụng uuid để tạo 1 chuỗi id ngẫu nhiên tương tự như cấu hình cho task service
  id: string;

  @Column() // gán decorator Collumn để thông báo với Tipler đây là column chứ k phải thuộc tính ngẫu nhiên
  title: string;

  @Column() // tương tự với title và status
  description: string;

  @Column()
  status: TaskStatus;

  // định nghĩa ManyToOne relation cho thuộc tính user bên trong task.entity
  // sử dụng decorator để cung cấp loại relation
  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  // arrow function ( hàm mũi tên ) là 2 tham số cho relation ManyToOne
  // (_type)=> User là tham số của thuộc tính user, đó là loại của thực thể user
  // (user) => user.tasks là tham số giúp chúng ta có thể truy cập đến thực thể user khi đang ở task
  // thuộc tính object eager
  user: User;
}
