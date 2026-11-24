import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { ADMIN_ROLE } from '../roles/roles.constants.js';
import { User } from './user.entity.js';

@Policy()
export class UserPolicy implements PolicyBefore<User> {
  before(user: User | null) {
    if (user?.roles?.some((role) => role.role_name === ADMIN_ROLE)) return true;
  }

  viewSelf(user: User | null) {
    return user !== null;
  }

  findAll(_user: User | null) {
    return false;
  }

  assignRoles(_user: User | null) {
    return false;
  }
}
