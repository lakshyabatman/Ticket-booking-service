const {Entity} = require('../../shared/enums')
const Role = {
    Admin: 'admin',
    User: 'user'
}

const Permission = {
    Read: 'read',
    Write: 'write'
}

const Scope = {
    Self: 'self',
    All: 'all'
}


const QueryContext = {
    [Role.Admin]: {
        [Entity.MovieEntity]: {permissions: [Permission.Read, Permission.Write], scope: Scope.All},
        [Entity.MovieScheduleEntity]: {permissions: [Permission.Write,Permission.Read], scope: Scope.All},
        [Entity.UserEntity]: {permissions: [Permission.Read, Permission.Write], scope: Scope.All},
        [Entity.TicketEntity]:{permissions: [Permission.Read, Permission.Write], scope: Scope.All}
    },
    [Role.User]: {
        [Entity.MovieEntity]: {permissions: [Permission.Read], scope: Scope.All},
        [Entity.MovieScheduleEntity]: {permissions: [Permission.Read], scope: Scope.All},
        [Entity.UserEntity]: {permissions: [Permission.Read, Permission.Write], scope: Scope.Self},
        [Entity.TicketEntity]:{permissions: [Permission.Read, Permission.Write], scope: Scope.Self}
    }
}


module.exports = {
    roles: Role,
    permissions: Permission,
    queryContext: QueryContext,
    scopes: Scope

} 