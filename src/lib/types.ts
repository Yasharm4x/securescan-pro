export interface Company {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
}

export interface VehicleData {
  vehicleNumber: string;
  vehicleModel: string;
  vehicleType: string;
  vehiclePhoto?: string;
}

export interface DriverData {
  driverName: string;
  phoneNumber: string;
  licenseId: string;
  driverPhoto?: string;
}

export interface QRRecord {
  id: string;
  companyId: string;
  vehicle: VehicleData;
  driver: DriverData;
  validTill?: string;
  purpose?: string;
  createdAt: string;
  signature: string;
  encodedData: string;
}

export interface VerificationResult {
  isValid: boolean;
  status: 'verified' | 'invalid' | 'expired' | 'tampered';
  message: string;
  data?: {
    company: Company;
    vehicle: VehicleData;
    driver: DriverData;
    validTill?: string;
    purpose?: string;
    createdAt: string;
  };
}
