import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // Băm mật khẩu ( hash password ) bằng mật khẩu Bcrypt

    // tạo hash sử dụng password là biến hashPassword và biến "muối"
    // phương thức không đồng bộ
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('salt', salt);
    console.log('hashPassword', hashedPassword);

    // Sử dụng phương thức create của repository để tạo một thực thể User
    // thay vì truyền vào mật khẩu thô, chúng ta sẽ truyền vào mật khẩu được hash
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    // Sử dụng phương thức save để lưu thực thể vào cơ sở dữ liệu

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }

  // hàm chức năng đăng nhập ( Signin )
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
