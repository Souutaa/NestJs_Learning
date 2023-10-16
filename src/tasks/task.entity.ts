import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status-enum';

@Entity()
export class Task {
    // cần nói với TyBorum là id là khoá/cột chính
    @PrimaryGeneratedColumn('uuid') // sử dụng decorator này sẽ tự động tạo ID cho task của chúng ta và xem đây là cột chính
    // sử dụng uuid để tạo 1 chuỗi id ngẫu nhiên tương tự như cấu hình cho task service
    id: string;

    @Column()// gán decorator Collumn để thông báo với Tipler đây là column chứ k phải thuộc tính ngẫu nhiên
    title: string;

    @Column()// tương tự với title và status
    description: string;

    @Column()
    status: TaskStatus


}