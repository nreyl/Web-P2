import { Policy } from '@nestjs/authorization';
import { ADMIN_ROLE, CONDUCTOR_ROLE, SUPERVISOR_ROLE, hasRole } from '../roles/roles.constants.js';
import { User } from '../users/user.entity.js';
import { Reservation } from './entities/reservation.entity.js';

@Policy()
export class ReservationPolicy {
  create(user: User | null) {
    return hasRole(user, CONDUCTOR_ROLE);
  }

  listAsConductor(user: User | null) {
    return hasRole(user, CONDUCTOR_ROLE);
  }

  listAsSupervisor(user: User | null) {
    return hasRole(user, SUPERVISOR_ROLE);
  }

  listAll(user: User | null) {
    return hasRole(user, ADMIN_ROLE);
  }

  // Requires reservation.spot to be loaded.
  updateStatus(user: User | null, reservation: Reservation) {
    return hasRole(user, SUPERVISOR_ROLE) && reservation.spot?.id_supervisor === user?.id;
  }

  remove(user: User | null, reservation: Reservation) {
    return hasRole(user, CONDUCTOR_ROLE) && reservation.id_user === user?.id;
  }
}
