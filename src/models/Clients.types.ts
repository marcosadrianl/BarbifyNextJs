export interface IClient {
  _id?: string;
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O"; //male, female, other
  clientBirthdate?: Date;
  clientPhone?: string;
  clientAddress?: string;
  clientImage?: string;
  clientActive: boolean;
  clientBaseColor?: string;
  clientHairType?: string;
  clientAllergies?: string;
  clientDiseases?: string;
  clientMedications?: string;
  clientNotes?: string;
  clientWhiteHairs: number;
  clientFromUserId?: string;
  clientPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
