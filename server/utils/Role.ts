// authorisation enum is a bit mask for user roles (user, admin, ...)
// multiple roles can be combined by adding the values together (user | admin)
export enum Role {
    user = 1,
    admin = 2,
    superadmin = 4
}
