const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');

// ─── Seeded Demo Users ────────────────────────────────────────────────────────
// In production these would come from a User MongoDB collection.
// Passwords are bcrypt hashed at salt 10. Plain text shown in comments for demo.
// All demo accounts use password: Unity@2025

const DEMO_PASSWORD_HASH = bcrypt.hashSync('Unity@2025', 10);

const DEMO_USERS = [
  {
    id:         'usr_001',
    name:       'Shri Rajesh Agrawal',
    email:      'collector@bhopal.mp.gov.in',
    employeeId: 'IAS-MP-2201',
    role:       'collector',
    department: 'District Collectorate',
    designation:'District Collector',
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:         'usr_002',
    name:       'Shri Pradeep Verma',
    email:      'engineer@bhopal.mp.gov.in',
    employeeId: 'PWD-BPL-4412',
    role:       'executive_engineer',
    department: 'Public Works Department',
    designation:'Executive Engineer',
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:         'usr_003',
    name:       'Smt. Kavita Singh',
    email:      'commissioner@bhopal.mp.gov.in',
    employeeId: 'IAS-MP-1887',
    role:       'commissioner',
    department: 'Bhopal Municipal Corporation',
    designation:'Municipal Commissioner',
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:         'usr_004',
    name:       'Shri Anand Pathak',
    email:      'nodal@bhopal.mp.gov.in',
    employeeId: 'GOV-MP-7731',
    role:       'nodal_officer',
    department: 'State Government Secretariat',
    designation:'Nodal Officer – UNITY',
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:         'usr_005',
    name:       'Ramesh Kumar',
    email:      'citizen@bhopal.mp.gov.in',
    employeeId: null,
    role:       'citizen',
    department: null,
    designation: null,
    passwordHash: DEMO_PASSWORD_HASH,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findUser(identifier) {
  return DEMO_USERS.find(
    (u) => u.email === identifier || u.employeeId === identifier
  );
}

function signTokens(user) {
  const payload = {
    id:         user.id,
    name:       user.name,
    email:      user.email,
    role:       user.role,
    department: user.department,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { token, refreshToken };
}

function safeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// ─── OTP Store (in-memory for demo) ──────────────────────────────────────────
// In production: use Redis with TTL or a database collection.
const otpStore = new Map(); // email → { otp, expiresAt }

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Controller Methods ───────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Body: { identifier: string, password: string }
 * Returns: { user, token, refreshToken, requiresOtp }
 */
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Employee ID / email and password are required.' });
    }

    const user = findUser(identifier.trim().toLowerCase()) || findUser(identifier.trim());

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate & store OTP for government roles (not citizens)
    if (user.role !== 'citizen' && user.role !== 'guest') {
      const otp = generateOtp();
      otpStore.set(user.email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min TTL
      console.log(`[UNITY Auth] OTP for ${user.email}: ${otp}`); // In prod: send via SMS/email

      return res.json({
        requiresOtp: true,
        email:       user.email,
        name:        user.name,
        role:        user.role,
        message:     `OTP sent to registered mobile/email. (Demo OTP: ${otp})`,
      });
    }

    // Citizens skip OTP
    const { token, refreshToken } = signTokens(user);
    return res.json({
      requiresOtp:  false,
      user:         safeUser(user),
      token,
      refreshToken,
    });

  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * POST /api/v1/auth/verify-otp
 * Body: { email: string, otp: string }
 * Returns: { user, token, refreshToken }
 */
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const record = otpStore.get(email.toLowerCase());

    if (!record) {
      return res.status(400).json({ message: 'OTP not found or already used. Please login again.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please login again.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Incorrect OTP.' });
    }

    // OTP valid — clear it and issue tokens
    otpStore.delete(email);
    const user = DEMO_USERS.find((u) => u.email === email.toLowerCase());
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { token, refreshToken } = signTokens(user);
    return res.json({ user: safeUser(user), token, refreshToken });

  } catch (err) {
    console.error('[Auth] OTP verify error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * POST /api/v1/auth/refresh
 * Body: { refreshToken: string }
 * Returns: { token }
 */
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user    = DEMO_USERS.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const { token } = signTokens(user);
    return res.json({ token });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }
}

/**
 * POST /api/v1/auth/forgot-password
 * Body: { email: string }
 * Returns: { message }
 */
async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = DEMO_USERS.find((u) => u.email === email?.toLowerCase());

  // Always return success to prevent email enumeration
  return res.json({
    message: user
      ? 'Password reset instructions have been sent to your registered email/mobile.'
      : 'If this email is registered, reset instructions will be sent.',
  });
}

/**
 * POST /api/v1/auth/logout
 * Just clears session on client; server is stateless (JWT).
 */
async function logout(req, res) {
  return res.json({ success: true, message: 'Logged out successfully.' });
}

/**
 * GET /api/v1/auth/me
 * Returns current user from token (protected route).
 */
async function me(req, res) {
  const user = DEMO_USERS.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: safeUser(user) });
}

module.exports = { login, verifyOtp, refresh, forgotPassword, logout, me };
