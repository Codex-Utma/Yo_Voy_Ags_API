import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [ReportsModule, TransactionsModule],
})
export class AppModule {}
