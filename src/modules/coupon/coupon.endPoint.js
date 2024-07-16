

import { AvailableRoles } from "../../middleware/auth.js";

export const endpoint = {
    create:[AvailableRoles.admin],
    update:[AvailableRoles.admin],
    delete:[AvailableRoles.admin],
    get:[AvailableRoles.admin],
}