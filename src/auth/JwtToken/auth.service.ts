import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import { JwtPayload } from '../jwt-payload.interface';
import { User } from '../user.entity';
import { OTPgene } from '../dto/Otpgene.dto';
import { otpgenerate } from '../otpGenerator';
import { updatePasswordDTO } from '../dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
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
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  //Google
  async signUpGoogle(_user: AuthUserDto): Promise<any> {
    if (_user) {
      const { username, typeAuth, password } = _user;
      // Sử dụng phương thức create của repository để tạo một thực thể User
      // thay vì truyền vào mật khẩu thô, chúng ta sẽ truyền vào mật khẩu được hash
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        username,
        typeAuth,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
      return {
        messsage: 'User created by Google Service',
      };
      // try {
      // } catch (error) {
      //   if (error.code === '23505')
      //     throw new ConflictException('Username already exists');
      //   else throw new InternalServerErrorException();
      // }
    } else {
      return {
        access_token: '',
      };
    }
  }

  async loginGoogle(_user: AuthUserDto): Promise<{ accessToken: string }> {
    const { username, password } = _user;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  // async changePassword(_user: changePassword): Promise<any> {
  //   const { username } = _user;
  //   const findUser = await this.usersRepository.findOne({
  //     where: { username },
  //   });
  //   if (!findUser) {
  //     throw Error(`Cant find user: ${username}`);
  //   }
  //   const otpDetail = {
  //     username,
  //     subject: 'Change Password',
  //     message: 'Change your password with the code below',
  //     duration: 1,
  //     otpgenera: otp,
  //   };

  //   const createdOTP = await this.usersRepository.create(otpDetail);
  //   console.log(createdOTP);
  //   return createdOTP;
  // }

  //async sendOTP(email: string) {
  async sendOTP(sendgmail: OTPgene) {
    const { username } = sendgmail;
    const userFind = await this.usersRepository.findOne({
      where: { username },
    });
    if (!userFind) {
      throw Error('User was not created at a previous time');
    }
    const otp = otpgenerate();
    await this.mailerService.sendMail({
      to: username,
      subject: 'OTP for password reset',
      text: `Your OTP for password reset is ${otp}`,
    });
    // const user = this.usersRepository.create({
    //   username,
    //   otp,
    // });
    userFind.otp = otp;
    await this.usersRepository.save(userFind);
    return {
      messsage: `OTP was sent to user ${userFind.username}`,
    };
  }

  async updateUserPassword(
    otprequest: string,
    _user: updatePasswordDTO,
  ): Promise<any> {
    const { username, otp, password } = _user;
    const userFind = await this.usersRepository.findOne({
      where: { username },
    });
    if (!userFind) {
      throw Error('Dont exist user');
    }
    if (otprequest.localeCompare(otp) === -1) {
      throw Error('OTP fail this OTP');
    }

    // Sử dụng phương thức create của repository để tạo một thực thể User
    // thay vì truyền vào mật khẩu thô, chúng ta sẽ truyền vào mật khẩu được hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // const user = this.usersRepository.create({
    //   password: hashedPassword,
    // });
    userFind.password = hashedPassword;
    await this.usersRepository.save(userFind);
    this.usersRepository.delete(otp);
    return {
      messsage: 'Password was updated by Google Service',
    };
    // try {
    // } catch (error) {
    //   if (error.code === '23505')
    //     throw new ConflictException('Username already exists');
    //   else throw new InternalServerErrorException();
    // }
  }
}
