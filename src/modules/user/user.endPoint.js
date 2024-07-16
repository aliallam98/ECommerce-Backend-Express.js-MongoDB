import { AvailableRoles } from "../../middleware/auth.js";
export const endpoint = {
    getCart: [AvailableRoles.admin, AvailableRoles.superAdmin],
//   update: [AvailableRoles.admin, AvailableRoles.superAdmin],
//   delete: [AvailableRoles.admin, AvailableRoles.superAdmin],
};
