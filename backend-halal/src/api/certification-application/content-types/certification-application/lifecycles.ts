import { sanitizeFields } from '../../../../utils/sanitize';
import { sendStatusEmail } from '../../../../utils/mailer';

const PLAIN_FIELDS = [
  'companyName',
  'taxCode',
  'address',
  'contactName',
  'phoneNumber',
  'email',
  'notes',
] as const;

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Đã tiếp nhận hồ sơ',
  under_review: 'Đang xem xét hồ sơ',
  site_visit_scheduled: 'Đã lên lịch khảo sát thực địa',
  approved: 'Hồ sơ đã được phê duyệt — chứng nhận đã được cấp',
  rejected: 'Hồ sơ không được chấp thuận',
};

const CERTIFICATE_VALIDITY_YEARS = 2;

async function issueCertificate(application: any) {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setFullYear(expiry.getFullYear() + CERTIFICATE_VALIDITY_YEARS);

  // documentId is already globally unique — derive the certificate number
  // from it instead of a counter query, so concurrent approvals can't collide.
  const certificateNumber = `HAL-${now.getFullYear()}-${application.documentId.slice(0, 8).toUpperCase()}`;

  await strapi.documents('api::certificate.certificate').create({
    data: {
      certificateNumber,
      companyName: application.companyName,
      category: application.category,
      issuedDate: now.toISOString().slice(0, 10),
      expiryDate: expiry.toISOString().slice(0, 10),
      status: 'active',
      application: application.documentId,
    } as any,
  });

  strapi.log.info(
    `[certification-application] Issued certificate ${certificateNumber} for application ${application.documentId}`
  );
}

export default {
  beforeCreate(event: any) {
    sanitizeFields(event.params.data, { plain: [...PLAIN_FIELDS] });
  },
  async beforeUpdate(event: any) {
    sanitizeFields(event.params.data, { plain: [...PLAIN_FIELDS] });

    // Stash the pre-update status so afterUpdate can detect a real transition.
    if (event.params.data?.applicationStatus !== undefined) {
      const where = event.params.where;
      const previous = await strapi.db
        .query('api::certification-application.certification-application')
        .findOne({ where, select: ['applicationStatus'] });
      event.state.previousStatus = previous?.applicationStatus;
    }
  },
  async afterUpdate(event: any) {
    // Only react when THIS update actually touched applicationStatus —
    // other updates (e.g. linking `applicant` right after create) must not
    // re-trigger the status-change email/certificate-issuance side effects.
    if (event.params.data?.applicationStatus === undefined) return;

    const newStatus = event.result?.applicationStatus;
    const previousStatus = event.state?.previousStatus;
    if (!newStatus || newStatus === previousStatus) return;

    const application = event.result;
    const label = STATUS_LABELS[newStatus] ?? newStatus;

    await sendStatusEmail(
      strapi,
      application.email,
      `Cập nhật hồ sơ chứng nhận Halal — ${label}`,
      `Xin chào ${application.contactName},\n\nHồ sơ đăng ký chứng nhận Halal của "${application.companyName}" vừa được cập nhật trạng thái: ${label}.\n\nTrân trọng,\nSaigonCert`
    );

    if (newStatus === 'approved') {
      try {
        await issueCertificate(application);
      } catch (err) {
        strapi.log.error(
          `[certification-application] Failed to auto-issue certificate for ${application.documentId}: ${err}`
        );
      }
    }
  },
};
