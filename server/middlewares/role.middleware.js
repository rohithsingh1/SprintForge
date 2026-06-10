import {AppError} from "../utils/AppError.js";

/**
 * authorize(...roles)
 *
 * Middleware factory that restricts access to users whose role
 * is included in the provided list. Must be used AFTER `authenticate`.
 *
 * @param {...string} roles - Allowed roles (e.g. "ADMIN", "MANAGER","MEMBER")
 * @returns {Function} Express middleware
 *
 * @example
 * router.post("/users", authenticate, authorize("ADMIN"), createUser);
 * router.get("/projects", authenticate, authorize("ADMIN", "MANAGER"), getProjects);
 */
export const authorize=(...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new AppError(401, "UNAUTHORIZED", "Authentication required")
            );
        }

        const {role}=req.user

        if (!roles.includes(role)) {
            return next(
                new AppError(
                    403,
                    "FORBIDDEN",
                    `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${role}`
                )
            )
        }

        next()
    }
}