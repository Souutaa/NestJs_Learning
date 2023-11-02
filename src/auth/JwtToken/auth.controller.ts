import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OTPgene } from '../dto/Otpgene.dto';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { updatePasswordDTO } from '../dto/update-password.dto';
import { AuthService } from './auth.service';
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
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    const jwt = this.authService.signUpGoogle({
      username: req.user.email,
      typeAuth: 1,
      password: '123124',
    });
    return jwt;
  }

  @Post('/gettoken')
  async getToken(@Body() otpgene: OTPgene) {
    return await this.authService.sendOTP({
      username: otpgene.username,
    });
  }

  @Patch('/updatePassword')
  updatePassword(@Body() updatepass: updatePasswordDTO): Promise<any> {
    return this.authService.updateUserPassword(updatepass);
  }
}
