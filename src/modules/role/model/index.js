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
    [Role.Admin] : {
        'movie': {permissions: [Permission.Read, Permission.Write], scope: Scope.All},
        'movie-schedule': {permissions: [Permission.Write,Permission.Read], scope: Scope.All},
        'user': {permissions: [Permission.Read, Permission.Write], scope: Scope.All},
        'ticket':{permissions: [Permission.Read, Permission.Write], scope: Scope.All}
    },
    [Role.User]: {
        'movie': {permissions: [Permission.Read], scope: Scope.All},
        'movie-schedule': {permissions: [Permission.Read], scope: Scope.All},
        'user': {permissions: [Permission.Read, Permission.Write], scope: Scope.Self},
        'ticket':{permissions: [Permission.Read, Permission.Write], scope: Scope.Self}
    }
}


module.exports = {
    roles: Role,
    permissions: Permission,
    queryContext: QueryContext,
    scopes: Scope

} 