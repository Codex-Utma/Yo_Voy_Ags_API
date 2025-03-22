import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReportTypeDto } from './dtos/report-types';
import { PrismaClient } from '@prisma/client';
import { AddReportDto } from './dtos/add-report';

const prisma = new PrismaClient();

@Injectable()
export class ReportsService {
  async getReportTypes(): Promise<ReportTypeDto[]> {
    try {
      const reportTypes = await prisma.reportType.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      if (reportTypes.length === 0) {
        throw new HttpException('No report types found', HttpStatus.NO_CONTENT);
      }

      return reportTypes;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addReport(report: AddReportDto) {
    try {
      const { reportTypeId, busId, description } = report;

      const isValidReportType = await this.ValidateReportTypeId(reportTypeId);
      if (!isValidReportType) {
        throw new HttpException('Invalid report type', HttpStatus.BAD_REQUEST);
      }

      const isValidBusId = await this.ValidateBusId(busId);
      if (!isValidBusId) {
        throw new HttpException('Invalid bus id', HttpStatus.BAD_REQUEST);
      }

      await prisma.report.create({
        data: {
          reportTypeId,
          busId,
          description,
        },
      });

      return { message: 'Report added successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Si es otro tipo de error, lanzar un 500
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getReports(reportTypeId: number | undefined) {
    try {
      const reports = await prisma.report.findMany({
        where: {
          reportTypeId: reportTypeId ? reportTypeId : undefined,
        },
        select: {
          id: true,
          description: true,
          createdAt: true,
          Bus: {
            select: {
              id: true,
              Route: {
                select: {
                  name: true,
                },
              },
            },
          },
          ReportType: {
            select: {
              name: true,
            },
          },
        },
      });

      reports.forEach((report) => {
        report.createdAt = new Date(
          report.createdAt.getTime() + 6 * 60 * 60 * 1000,
        );
      });

      if (reports.length === 0) {
        throw new HttpException('No reports found', 204);
      }
      const response = {
        message: 'Data found',
        data: reports,
      };
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  private async ValidateBusId(busId: number): Promise<boolean> {
    const bus = await prisma.bus.findUnique({
      where: {
        id: busId,
      },
    });
    return !!bus;
  }

  private async ValidateReportTypeId(reportTypeId: number): Promise<boolean> {
    const reportType = await prisma.reportType.findUnique({
      where: {
        id: reportTypeId,
      },
    });
    return !!reportType;
  }
}
