export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  expiresIn: '24h',
  refreshExpiresIn: '7d',
};

export const bcryptConfig = {
  saltRounds: 10,
};
