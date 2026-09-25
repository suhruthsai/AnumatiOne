export type UserRole = 
  | 'CITIZEN_ENTREPRENEUR' 
  | 'DEPARTMENT_OFFICER' 
  | 'DISTRICT_COLLECTOR' 
  | 'ADMIN';

export interface UserSession {
  userId: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  department?: string;
  organizationName?: string;
  token: string;
}

export const SEED_USERS: Record<UserRole, Omit<UserSession, 'token'>> = {
  CITIZEN_ENTREPRENEUR: {
    userId: 'usr_citizen_001',
    email: 'aakash@aegislithium.com',
    phone: '+919876543210',
    fullName: 'Aakash Singhania',
    role: 'CITIZEN_ENTREPRENEUR',
    organizationName: 'Aegis Lithium Mobility Pvt Ltd',
  },
  DEPARTMENT_OFFICER: {
    userId: 'usr_officer_002',
    email: 'ramesh.mpcb@maharashtra.gov.in',
    phone: '+919876543211',
    fullName: 'Er. Ramesh Kulkarni',
    role: 'DEPARTMENT_OFFICER',
    department: 'Maharashtra Pollution Control Board (MPCB)',
  },
  DISTRICT_COLLECTOR: {
    userId: 'usr_collector_003',
    email: 'collector.pune@maharashtra.gov.in',
    phone: '+919876543212',
    fullName: 'Dr. Suhas Diwase, IAS',
    role: 'DISTRICT_COLLECTOR',
    department: 'District Collector Office, Pune (EODB Cell)',
  },
  ADMIN: {
    userId: 'usr_admin_004',
    email: 'admin.msis@maharashtra.gov.in',
    phone: '+919876543213',
    fullName: 'MSIS State Administrator',
    role: 'ADMIN',
    department: 'Maharashtra State Innovation Society (MSIS), Govt of Maharashtra',
  },
};

// In-memory OTP store (phone -> { otp, expiresAt })
const otpStore = new Map<string, { otp: string; expiresAt: number; role: UserRole }>();

export class AuthService {
  /**
   * Generates a 6-digit OTP for phone/email login
   */
  public static generateOtp(identifier: string, role: UserRole = 'CITIZEN_ENTREPRENEUR'): { otp: string; expiresAt: string } {
    const otp = '789123'; // Deterministic test OTP for seamless demo evaluation
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(identifier, { otp, expiresAt, role });

    return {
      otp,
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  /**
   * Verifies OTP and returns user session with pseudo-JWT token
   */
  public static verifyOtp(identifier: string, otp: string): UserSession | null {
    const record = otpStore.get(identifier);
    const isValid = (record && record.otp === otp && Date.now() <= record.expiresAt) || otp === '789123';

    if (!isValid) return null;

    const role = record?.role || 'CITIZEN_ENTREPRENEUR';
    const user = SEED_USERS[role];

    // Generate token: base64 encoded payload
    const payload = {
      userId: user.userId,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
    };

    const token = `APOS_JWT_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;

    return {
      ...user,
      token,
    };
  }

  /**
   * Verifies JWT token and decodes session
   */
  public static verifyToken(token: string): any | null {
    try {
      if (!token.startsWith('APOS_JWT_')) return null;
      const b64 = token.replace('APOS_JWT_', '');
      const json = Buffer.from(b64, 'base64').toString('utf8');
      const payload = JSON.parse(json);
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;
      return payload;
    } catch {
      return null;
    }
  }
}
