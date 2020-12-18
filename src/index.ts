import Ability from './ability';
import { PERMISSIONS } from './types/permissions';
import { AbilityInterface } from './types/ability-interface';
import { NotAuthorizedError } from './errors/not-authorized-error';

export default Ability;
export { PERMISSIONS, AbilityInterface, NotAuthorizedError };