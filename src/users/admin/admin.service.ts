import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AdminService {
  constructor(private readonly authService: AuthService) {}

  async getAllSellers(page: number, limit: number, filter: any) {
    const users = await this.authService.findUsersByRole(
      'seller',
      page,
      limit,
      filter,
    );
    const totalSellersNumber =
      await this.authService.countUsersByRole('seller');
    return {
      users,
      currentPage: page,
      numberPerPage: limit,
      totalSellersNumber: totalSellersNumber,
    };
  }

  async getAllBuyers(page: number, limit: number, filter: any) {
    const users = await this.authService.findUsersByRole(
      'buyer',
      page,
      limit,
      filter,
    );
    const totalBuyersNumber = await this.authService.countUsersByRole('buyer');
    return {
      users,
      currentPage: page,
      numberPerPage: limit,
      totalSellersNumber: totalBuyersNumber,
    };
  }

  async getAllAdmins(page: number, limit: number, filter: any) {
    const users = await this.authService.findUsersByRole(
      'admin',
      page,
      limit,
      filter,
    );
    const totalAdminsNumber = await this.authService.countUsersByRole('admin');
    return {
      users,
      currentPage: page,
      numberPerPage: limit,
      totalSellersNumber: totalAdminsNumber,
    };
  }

  async getOneUserById(id: string) {
    return this.authService.findUserById(id);
  }
  async updateUserStatus(id: string, isActive: boolean) {
    return this.authService.updateUserStatus(id, isActive);
  }

  async deleteUser(id: string) {
    return this.authService.deleteUser(id);
  }

  async countSellers(): Promise<number> {
    return this.authService.countUsersByRole('seller');
  }

  async countBuyers(): Promise<number> {
    return this.authService.countUsersByRole('buyer');
  }
}
