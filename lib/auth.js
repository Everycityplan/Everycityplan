import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';

// In-memory store for demo purposes. Replace with a DB in production.
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-me';

export async function registerUser({ name, email, password }) {
  const existing = users.find((u) => u.email === email.toLowerCase());
  if (existing) {
    throw new Error('User already exists');
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, email: email.toLowerCase(), password: hashed };
  users.push(newUser);
  return newUser;
}

export async function loginUser({ email, password }) {
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw new Error('Invalid credentials');
  }
  return user;
}

export function createSession(user, res) {
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('ecp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
  );
}

export function clearSession(res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('ecp_token', '', { httpOnly: true, path: '/', maxAge: -1 })
  );
}

export function getUserFromRequest(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.ecp_token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.sub, email: decoded.email, name: decoded.name };
  } catch (err) {
    return null;
  }
}
