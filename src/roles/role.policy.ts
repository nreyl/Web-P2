import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { User } from '../users/user.entity.js';
import { ADMIN_ROLE } from './roles.constants.js';

@Policy()
export class RolePolicy implements PolicyBefore<User> {
  before(user: User | null) {
    if (user?.roles?.some((role) => role.role_name === ADMIN_ROLE)) return true;
  }

  create(_user: User | null) {
    return false;
  }

  findAll(_user: User | null) {
    return false;
  }
}
