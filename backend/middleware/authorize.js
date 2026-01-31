// authorize('admin') → only admin allowed
// authorize(['admin', 'user']) → both roles allowed
module.exports = function authorize(roles) {
    // Convert single role to array for uniform handling
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
        next();
    };
};
