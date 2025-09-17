import jwt from 'jsonwebtoken';

export class SocketAuthMiddleware {
  constructor(jwtSecret, logger) {
    this.jwtSecret = jwtSecret;
    this.logger = logger;
  }

  authenticate(socket, next) {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Attach user info to socket
      socket.userId = decoded.sub || decoded.id;
      socket.userName = decoded.name;
      socket.userRole = decoded.role;
      socket.userEmail = decoded.email;

      this.logger.debug(`Socket authenticated for user: ${socket.userId} (${socket.userName})`);

      next();
    } catch (error) {
      this.logger.warn('Socket authentication failed:', error.message);
      next(new Error('Invalid authentication token'));
    }
  }

  requireRole(roles) {
    return (socket, next) => {
      if (!socket.userRole) {
        return next(new Error('User role not available'));
      }

      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(socket.userRole)) {
        return next(new Error('Insufficient permissions'));
      }

      next();
    };
  }

  requireStaff() {
    return this.requireRole(['admin', 'staff', 'psikolog']);
  }

  requireAdmin() {
    return this.requireRole('admin');
  }
}