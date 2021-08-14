const { permissions, scopes } = require("../../modules/role/model")
const RoleService = require("../../modules/role/providers")
const HTTPStatusCode = require("../../modules/shared/httpcode")

const AuthenicatedRead = (entity) => (req, res, next) => {
    if(!RoleService.isValidPermission(req.user.role,entity, permissions.Read,scopes.All)) {
      return res.status(HTTPStatusCode.NOT_AUTHORISED).json({message: 'Not Authorised'})
    }
    next()
}

const AuthenicatedWrite = (entity) => (req, res, next) => {
    if(!RoleService.isValidPermission(req.user.role,entity, permissions.Write,scopes.All)) {
      return res.status(HTTPStatusCode.NOT_AUTHORISED).json({message: 'Not Authorised'})
    }
    next()
}

module.exports = {
    AuthenicatedRead,
    AuthenicatedWrite
}
