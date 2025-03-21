import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [ReportsModule, TransactionsModule, TransfersModule],
})
export class AppModule {}
