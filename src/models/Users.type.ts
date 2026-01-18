export interface IUser {
  _id?: string;
  userName: string;
  userLastName?: string;
  userEmail: string;
  userPassword: string;
  userHasThisBarbers: string[];

  userCity: string;
  userState?: string;
  userAddress?: string;
  userPostalCode?: string;

  userPhone?: string;
  userActive: boolean;
  userLevel: 0 | 1;
  paymentStatus: boolean;
  userRole?: string;
  userSex?: string;
  userBirthDate?: string; // ✅ Mayúscula D

  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
