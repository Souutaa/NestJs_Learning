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
    const { username, typeAuth, password } = _user;
    const userFind = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userFind) {
      // thay vì truyền vào mật khẩu thô, chúng ta sẽ truyền vào mật khẩu được hash
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Sử dụng phương thức create của repository để tạo một thực thể User
      const user = this.usersRepository.create({
        username,
        typeAuth,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
      return {
        messsage: 'User created by Google Service',
      };
    } else {
      return {
        message: 'User existed in a previous time ',
        access_token: '',
      };
    }
  }

  async sendOTP(sendgmail: OTPgene) {
    const { username } = sendgmail;
    const userFind = await this.usersRepository.findOne({
      where: { username },
    });
    if (!userFind) {
      return {
        messsage: `User was not created at a previous time`,
      };
    }
    const otp = otpgenerate();
    await this.mailerService
      .sendMail({
        //Người sẽ được gửi mail đến
        to: username,

        //Tiêu đề của mail
        subject: 'OTP for change password',

        //Thông tin cần truyền đạt trong mail
        text: `Your OTP for password reset is ${otp}`,

        //sử dụng html để custom cho thông tin
        html: `<p>Your OTP for password reset is <span style="background-color:#FFF8DC; color: red; font-weight:bold; font-style:italic">${otp}</span></p>`,
      })
      .then((response) => ({ success: true }))
      .catch((error) => {
        return { success: false, error: error };
      });

    userFind.otp = otp;
    await this.usersRepository.save(userFind);
    return {
      messsage: `OTP was sent to user ${userFind.username}`,
    };
  }

  async updateUserPassword(
    _user: updatePasswordDTO,
  ): Promise<any> {
    const { username, otp, password } = _user;
    const userFind = await this.usersRepository.findOne({
      where: { username },
    });
    if (!userFind) {
      return {
        messsage: 'Dont exist user',
      };
    }
    if (otp.localeCompare(userFind.otp) === -1) {
      return {
        messsage: 'OTP is incorrect',
      };
    }
    // thay vì truyền vào mật khẩu thô, chúng ta sẽ truyền vào mật khẩu được hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    userFind.password = hashedPassword;
    userFind.otp = null;

    // Sử dụng phương thức create của repository để tạo một thực thể User
    await this.usersRepository.save(userFind);
    return {
      messsage: 'Password was updated',
    };
  }
}
