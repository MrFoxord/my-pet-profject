import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InternalAuthGuard } from './internal-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.INTERNAL_API_SECRET,
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [InternalAuthGuard],
  exports: [InternalAuthGuard, JwtModule],
})
export class AuthModule {}
