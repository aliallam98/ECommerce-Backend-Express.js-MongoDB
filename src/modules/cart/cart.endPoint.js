import { AvailableRoles } from "../../middleware/auth.js";

export const endpoint = {
  add: [AvailableRoles.user,AvailableRoles.superAdmin],
  get: [AvailableRoles.user, AvailableRoles.superAdmin, AvailableRoles.admin],
  delete: [AvailableRoles.user,AvailableRoles.superAdmin],
  clear: [AvailableRoles.user,AvailableRoles.superAdmin],
  getById: [AvailableRoles.user, AvailableRoles.admin,AvailableRoles.superAdmin],
};
