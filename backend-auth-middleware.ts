/**
 * @file backend-auth-middleware.ts
 * @description This file contains pseudo-code for a Node.js/Express middleware.
 * It demonstrates how to securely verify a JSON Web Token (JWT) from an HttpOnly cookie
 * and check for specific user permissions (e.g., 'seller') before allowing access
 * to a protected backend route. This server-side check is crucial and ensures
 * that UI-based role hiding is not the only security measure.
 */

// In a real application, you would import types from your framework and libraries.
// e.g., import { Request, Response, NextFunction } from 'express';
// FIX: Import 'jsonwebtoken' to resolve 'jwt' is not defined error.
import * as jwt from 'jsonwebtoken';

// --- Type Definitions (for clarity) ---
interface Request {
  cookies: { [key: string]: string };
  user?: DecodedJwtPayload; // Attach decoded user info to the request object
}
interface Response {
  status: (code: number) => { json: (payload: object) => void };
}
type NextFunction = () => void;

interface DecodedJwtPayload {
  userId: string;
  roles: string[]; // e.g., ['buyer', 'seller']
  iat: number;
  exp: number;
}


/**
 * Middleware to verify JWT and check if the user has 'seller' permissions.
 *
 * This function should be placed before any route handler that requires
 * seller-level access (e.g., updating a product, viewing sales data).
 *
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function in the stack.
 */
export const verifySellerPermission = (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract the token from the HttpOnly cookie.
  // The cookie name 'sessionToken' should match what the login endpoint sets.
  const token = req.cookies.sessionToken;

  if (!token) {
    // If no token is found, the user is not authenticated.
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  try {
    // 2. Verify the token's signature and expiration.
    // process.env.JWT_SECRET should be a long, complex, secret string stored securely
    // as an environment variable on the server. It should NEVER be exposed to the frontend.
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedJwtPayload;

    // 3. Check for the required role/permission in the token's payload.
    // This is the core authorization step. We check if the 'roles' array includes 'seller'.
    if (!decoded.roles || !decoded.roles.includes('seller')) {
      // The user is authenticated but does not have the necessary permissions.
      return res.status(403).json({ message: 'Forbidden: Seller access required.' });
    }

    // 4. (Optional but recommended) Attach user info to the request object.
    // This makes the decoded user data available to downstream route handlers
    // without needing to decode the token again.
    req.user = decoded;

    // 5. If all checks pass, proceed to the actual route handler.
    next();

  } catch (error) {
    // This block catches errors from jwt.verify(), such as:
    // - TokenExpiredError: The token has expired.
    // - JsonWebTokenError: The token is malformed or the signature is invalid.
    if (error.name === 'TokenExpiredError') {
       return res.status(401).json({ message: 'Unauthorized: Token has expired.' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};


// --- Example Usage in an Express Router ---
/*
import { Router } from 'express';
import { getSellerAnalytics, updateProduct } from './seller-controllers';
import { verifySellerPermission } from './backend-auth-middleware';

const sellerRouter = Router();

// Apply the middleware to all routes in this file that require seller permissions.
sellerRouter.use(verifySellerPermission);

// Now, only authenticated users with a 'seller' role can access these endpoints.
sellerRouter.get('/analytics', getSellerAnalytics);
sellerRouter.put('/products/:productId', updateProduct);

export default sellerRouter;
*/
