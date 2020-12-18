import Ability from './ability';
import { Permissions } from './types/permissions';
import { AbilityInterface } from './types/ability-interface';
import { NotAuthorizedError } from './errors/not-authorized-error';

export default Ability;
export { Permissions, AbilityInterface, NotAuthorizedError };