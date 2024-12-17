import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AdminService {
  constructor(private readonly authService: AuthService) {}

  async getAllSellers() {
    return this.authService.findUsersByRole('seller');
  }

  async getAllBuyers() {
    return this.authService.findUsersByRole('buyer');
  }

  async getAllAdmins() {
    return this.authService.findUsersByRole('admin');
  }
}
