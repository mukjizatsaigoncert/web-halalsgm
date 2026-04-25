import { sanitizeFields } from '../../../../utils/sanitize';

export default {
  beforeCreate(event: any) {
    sanitizeFields(event.params.data, {
      plain: ['name', 'description'],
      rich: ['detailInfo'],
    });
  },
  beforeUpdate(event: any) {
    sanitizeFields(event.params.data, {
      plain: ['name', 'description'],
      rich: ['detailInfo'],
    });
  },
};
