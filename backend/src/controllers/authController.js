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
 * Returns: { user, token, refreshToken }
 */
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Employee ID / email and password are required.",
      });
    }

    const user =
      findUser(identifier.trim().toLowerCase()) ||
      findUser(identifier.trim());

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    // Issue JWT tokens
    const { token, refreshToken } = signTokens(user);

    return res.status(200).json({
      requiresOtp: false,
      user: safeUser(user),
      token,
      refreshToken,
    });

  } catch (err) {
    console.error("[Auth] Login error:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
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

async function me(req, res) {
  const user = DEMO_USERS.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: safeUser(user) });
}

async function verifyOtp(req, res) {
  return res.status(400).json({ message: "OTP verification is disabled. Please use direct login." });
}

module.exports = { login, verifyOtp, refresh, forgotPassword, logout, me };
