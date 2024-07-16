import { AvailableRoles } from "../../middleware/auth.js";
export const endpoint = {
    create: [AvailableRoles.admin,AvailableRoles.superAdmin],
    update: [AvailableRoles.admin,AvailableRoles.superAdmin],
    delete: [AvailableRoles.admin,AvailableRoles.superAdmin],

    add: [AvailableRoles.user,AvailableRoles.superAdmin],
    remove: [AvailableRoles.user,AvailableRoles.superAdmin],
    clear: [AvailableRoles.user,AvailableRoles.superAdmin],
};
