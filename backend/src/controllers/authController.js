const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ─── Fallback secrets (used when env vars are missing — e.g. first Render deploy) ──
const JWT_SECRET         = process.env.JWT_SECRET         || 'unity_govt_bhopal_secret_key_2025_mp';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'unity_refresh_bhopal_secret_key_2025_mp';
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN     || '8h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// ─── Demo Users ───────────────────────────────────────────────────────────────
// All accounts use password: Unity@2025
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Unity@2025', 10);

const DEMO_USERS = [
  {
    id:          'usr_001',
    name:        'Shri Rajesh Agrawal',
    email:       'collector@bhopal.mp.gov.in',
    employeeId:  'IAS-MP-2201',
    role:        'collector',
    department:  'District Collectorate',
    designation: 'District Collector',
    avatar:      null,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:          'usr_002',
    name:        'Shri Pradeep Verma',
    email:       'engineer@bhopal.mp.gov.in',
    employeeId:  'PWD-BPL-4412',
    role:        'executive_engineer',
    department:  'Public Works Department',
    designation: 'Executive Engineer',
    avatar:      null,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:          'usr_003',
    name:        'Smt. Kavita Singh',
    email:       'commissioner@bhopal.mp.gov.in',
    employeeId:  'IAS-MP-1887',
    role:        'commissioner',
    department:  'Bhopal Municipal Corporation',
    designation: 'Municipal Commissioner',
    avatar:      null,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:          'usr_004',
    name:        'Shri Anand Pathak',
    email:       'nodal@bhopal.mp.gov.in',
    employeeId:  'GOV-MP-7731',
    role:        'nodal_officer',
    department:  'State Government Secretariat',
    designation: 'Nodal Officer – UNITY',
    avatar:      null,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id:          'usr_005',
    name:        'Ramesh Kumar',
    email:       'citizen@bhopal.mp.gov.in',
    employeeId:  null,
    role:        'citizen',
    department:  null,
    designation: null,
    avatar:      null,
    passwordHash: DEMO_PASSWORD_HASH,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findUser(identifier) {
  if (!identifier) return null;
  const id = identifier.trim().toLowerCase();
  return DEMO_USERS.find(
    (u) => u.email === id || (u.employeeId && u.employeeId.toLowerCase() === id)
  ) || DEMO_USERS.find(
    (u) => u.email === identifier.trim() || u.employeeId === identifier.trim()
  ) || null;
}

function safeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function signTokens(user) {
  const payload = {
    id:         user.id,
    name:       user.name,
    email:      user.email,
    role:       user.role,
    department: user.department,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { token, refreshToken };
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Body: { identifier: string, password: string }
 * Response: { requiresOtp: false, user, token, refreshToken }
 */
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Employee ID / email and password are required.' });
    }

    const user = findUser(identifier);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { token, refreshToken } = signTokens(user);

    return res.status(200).json({
      requiresOtp:  false,
      user:         safeUser(user),
      token,
      refreshToken,
    });

  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
}

/**
 * POST /api/v1/auth/verify-otp
 * OTP flow is disabled — direct login only.
 */
async function verifyOtp(req, res) {
  return res.status(400).json({
    message: 'OTP verification is disabled. Use direct login.',
  });
}

/**
 * POST /api/v1/auth/refresh
 * Body: { refreshToken: string }
 * Response: { token }
 */
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required.' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
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
 */
async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = DEMO_USERS.find((u) => u.email === email?.toLowerCase());
  return res.json({
    message: user
      ? 'Password reset instructions have been sent to your registered email/mobile.'
      : 'If this email is registered, reset instructions will be sent.',
  });
}

/**
 * POST /api/v1/auth/logout
 */
async function logout(req, res) {
  return res.json({ success: true, message: 'Logged out successfully.' });
}

/**
 * GET /api/v1/auth/me
 */
async function me(req, res) {
  try {
    const user = DEMO_USERS.find((u) => u.id === req.user?.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user.' });
  }
}

module.exports = { login, verifyOtp, refresh, forgotPassword, logout, me };
