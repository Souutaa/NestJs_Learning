import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserDto } from '../dto/auth-user.dto';
import { otpgenerate } from '../otpGenerator';
import * as nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import { OTPgene } from '../dto/Otpgene.dto';
import { updatePasswordDTO } from '../dto/update-password.dto';
import { getUser } from 'src/tasks/dto/get-user.decorator';
import { User } from '../user.entity';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // const user = this.googleService.googleLogin(req);
    //const jwt = this.authService.loginGoogle({ username: req.user.email });
    const jwt = this.authService.signUpGoogle({
      username: req.user.email,
      typeAuth: 1,
      password: '123124',
    });
    // const jwt = this.authService.loginGoogle({
    //   username: req.user.email,
    //   typeAuth: 1,
    // });
    return jwt;
  }

  // @Post('/changepassword')
  // ChangePassword(@Body() authuserDTO: AuthUserDto): Promise<any> {
  //   return this.authService.changePassword(authuserDTO);
  // }
  @Post('/gettoken')
  async getToken(@Body() otpgene: OTPgene) {
    return await this.authService.sendOTP({
      username: otpgene.username,
    });
  }

  @Patch('/updatePassword/:otp')
  updatePassword(
    @Param('otp') otp: string,
    @Body() updatepass: updatePasswordDTO,
  ): Promise<any> {
    return this.authService.updateUserPassword(otp, updatepass);
  }
}
