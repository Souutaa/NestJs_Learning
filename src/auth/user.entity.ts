import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') //tự động tạo một unique ID
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
