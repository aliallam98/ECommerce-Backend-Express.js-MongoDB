import { AvailableRoles } from "../../middleware/auth.js";
export const endpoint = {
  create: [AvailableRoles.admin, AvailableRoles.superAdmin],
  update: [AvailableRoles.admin, AvailableRoles.superAdmin],
  delete: [AvailableRoles.admin, AvailableRoles.superAdmin],
};
