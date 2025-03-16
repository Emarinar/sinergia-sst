const verificarRol = (rolRequerido) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Acceso denegado. No autenticado' });
        }

        if (req.usuario.rol !== rolRequerido) {
            return res.status(403).json({ error: `Acceso denegado. Se requiere rol de ${rolRequerido}` });
        }

        next();
    };
};

module.exports = verificarRol;
