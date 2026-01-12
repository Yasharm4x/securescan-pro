import CryptoJS from "crypto-js";
import { QRRecord, VehicleData, DriverData, VerificationResult } from "./types";
import { getCompanyById } from "./companies";

/* ------------------------------------------------------------------ */
/* Environment Safety Helpers                                          */
/* ------------------------------------------------------------------ */

const isBrowser = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined";

/* ------------------------------------------------------------------ */
/* Crypto Configuration                                                */
/* ------------------------------------------------------------------ */

/**
 * NOTE:
 * This secret is fine for DEMO / FRONTEND verification.
 * For production security, signatures must be generated server-side.
 */
const SECRET_KEY = "VERIFLOW_SECRET_2024";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface QRPayload {
  companyId: string;
  vehicle: VehicleData;
  driver: DriverData;
  validTill?: string;
  purpose?: string;
  createdAt: string;
  signature: string;
}

/* ------------------------------------------------------------------ */
/* Signature + Payload Utilities                                       */
/* ------------------------------------------------------------------ */

export const generateSignature = (
  data: Omit<QRPayload, "signature">
): string => {
  const dataString = JSON.stringify(data);
  return CryptoJS.HmacSHA256(dataString, SECRET_KEY).toString(
    CryptoJS.enc.Hex
  );
};

export const createQRPayload = (
  companyId: string,
  vehicle: VehicleData,
  driver: DriverData,
  validTill?: string,
  purpose?: string
): QRPayload => {
  const createdAt = new Date().toISOString();

  const baseData = {
    companyId,
    vehicle,
    driver,
    validTill,
    purpose,
    createdAt,
  };

  const signature = generateSignature(baseData);

  return {
    ...baseData,
    signature,
  };
};

export const encodePayload = (payload: QRPayload): string => {
  const jsonString = JSON.stringify(payload);
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(jsonString)
  );
};

export const decodePayload = (encoded: string): QRPayload | null => {
  try {
    const decoded = CryptoJS.enc.Base64.parse(encoded);
    const jsonString = decoded.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to decode QR payload:", err);
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* Verification Logic                                                   */
/* ------------------------------------------------------------------ */

export const verifyPayload = (encoded: string): VerificationResult => {
  const payload = decodePayload(encoded);

  if (!payload) {
    return {
      isValid: false,
      status: "invalid",
      message:
        "Unable to decode verification data. The QR code may be corrupted.",
    };
  }

  const company = getCompanyById(payload.companyId);
  if (!company) {
    return {
      isValid: false,
      status: "invalid",
      message:
        "Unknown company identifier. This QR code is not valid.",
    };
  }

  // Verify signature integrity
  const { signature, ...dataWithoutSignature } = payload;
  const expectedSignature = generateSignature(dataWithoutSignature);

  if (signature !== expectedSignature) {
    return {
      isValid: false,
      status: "tampered",
      message:
        "Signature verification failed. This QR code may have been tampered with.",
    };
  }

  // Expiry validation
  if (payload.validTill) {
    const expiryDate = new Date(payload.validTill);
    if (expiryDate < new Date()) {
      return {
        isValid: false,
        status: "expired",
        message: `This verification expired on ${expiryDate.toLocaleDateString()}.`,
        data: {
          company,
          vehicle: payload.vehicle,
          driver: payload.driver,
          validTill: payload.validTill,
          purpose: payload.purpose,
          createdAt: payload.createdAt,
        },
      };
    }
  }

  return {
    isValid: true,
    status: "verified",
    message:
      "This vehicle and driver are verified and authentic.",
    data: {
      company,
      vehicle: payload.vehicle,
      driver: payload.driver,
      validTill: payload.validTill,
      purpose: payload.purpose,
      createdAt: payload.createdAt,
    },
  };
};

/* ------------------------------------------------------------------ */
/* Local Storage Utilities (PRODUCTION SAFE)                            */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "veriflow_qr_records";

export const getStoredRecords = (
  companyId: string
): QRRecord[] => {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allRecords: QRRecord[] = JSON.parse(stored);
    return allRecords.filter(
      (record) => record.companyId === companyId
    );
  } catch (err) {
    console.error(
      "Failed to read stored QR records:",
      err
    );
    return [];
  }
};

export const saveRecord = (record: QRRecord): void => {
  if (!isBrowser()) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allRecords: QRRecord[] = stored
      ? JSON.parse(stored)
      : [];

    allRecords.unshift(record);

    // Keep last 100 records max
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(allRecords.slice(0, 100))
    );
  } catch (err) {
    console.error(
      "Failed to save QR record:",
      err
    );
  }
};

export const generateRecordId = (): string => {
  return `qr_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 11)}`;
};
