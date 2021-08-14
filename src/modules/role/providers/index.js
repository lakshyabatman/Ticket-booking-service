
const {Entity, AccessMethods} = require('../../shared/enums')
const {roles, permissions, queryContext, scopes} = require('../model')



class RoleService {
    /**
     * 
     * @param {Role} role 
     * @returns Object
     */
    static getPermissions(role) {
        switch(role) {
            case roles.Admin:
                return  queryContext[roles.Admin]
            case roles.User:
                return queryContext[roles.User]
            default: 
                throw new Error(`The provided Role ${role} doesn't exist`)
        }
    }


    /**
     * 
     * @param {Role} role 
     * @param {string} entity 
     * @param {Permission} permission 
     * @param {Scope} scope 
     * @returns boolean
     */
    static isValidPermission (role,entity, permission, scope) {
        if(role !=roles.Admin && role !=roles.User) throw new Error(`The provided Role ${role} doesn't exist`)
        let entities = [Entity.UserEntity,Entity.MovieEntity,Entity.TicketEntity,Entity.MovieScheduleEntity];
        if(permission !=permissions.Write && permission!=permissions.Read)  throw new Error(`The provided Permission ${permission} doesn't exist`)
        if(!entities.includes(entity)) throw new Error(`The provided Entity ${entity} doesn't exist`)
        if(scope != scopes.Self && scope != scopes.All) throw new Error(`The provided Scope ${scope} doesn't exist`)


        return queryContext[role][entity].permissions.includes(permission) && queryContext[role][entity].scope == scope
        
    }

    static getActionBasedOnAccessMethod (method) {
        if(method == AccessMethods.DELETE || method == AccessMethods.PUT ||  method == AccessMethods.POST) return permissions.Write
        return permissions.Read
    }


    static roleBasedAuth (role,method,entity,scope) {
        let action = this.getActionBasedOnAccessMethod(method)
        return this.isValidPermission(role,entity,action,scope)
    
    }
}

module.exports = RoleService