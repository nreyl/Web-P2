import { Policy } from '@nestjs/authorization';
import { ADMIN_ROLE, SUPERVISOR_ROLE, CONDUCTOR_ROLE, hasRole } from '../roles/roles.constants.js';
import { User } from '../users/user.entity.js';
import { Parking } from './parking.entity.js';

@Policy()
export class ParkingPolicy {
  create(user: User | null) {
    return hasRole(user, CONDUCTOR_ROLE);
  }

  listAsSupervisor(user: User | null) {
    return hasRole(user, SUPERVISOR_ROLE);
  }

  listAsConductor(user: User | null) {
    return hasRole(user, CONDUCTOR_ROLE);
  }

  listAll(user: User | null) {
    return hasRole(user, ADMIN_ROLE);
  }

  updateStatus(user: User | null, parking: Parking) {
    return hasRole(user, SUPERVISOR_ROLE) && parking.id_supervisor === user?.id;
  }

  remove(user: User | null, parking: Parking) {
    return hasRole(user, CONDUCTOR_ROLE) && parking.id_user === user?.id;
  }
}
