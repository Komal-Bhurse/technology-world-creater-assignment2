const authorizedRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return res.status(403).json({ status: 'failed', message: "Access Denied!" ,data: req.user,})
        }
        next();
    }
}

export default authorizedRole