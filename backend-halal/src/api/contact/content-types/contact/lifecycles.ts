import { sanitizeFields } from '../../../../utils/sanitize';

const PLAIN_FIELDS = ['name', 'phoneNumber', 'title', 'description', 'email'] as const;

export default {
  beforeCreate(event: any) {
    sanitizeFields(event.params.data, { plain: [...PLAIN_FIELDS] });
  },
  beforeUpdate(event: any) {
    sanitizeFields(event.params.data, { plain: [...PLAIN_FIELDS] });
  },
};
