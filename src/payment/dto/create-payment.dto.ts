import { User } from "src/auth/schema/user.schema";

export class CreatePaymentDto {
    amount:number;
    buyer:User
}
