import { Module } from '@nestjs/common';
import { EmailUtil } from './email-service';

@Module({
  providers: [EmailUtil],
  exports: [EmailUtil],
})
export class EmailModule {}
