// ── Revenue split configuration ─────────────────────────────────
// Single source of truth for how a paid material's price is split.
// Change this one number to adjust the split platform-wide.
// If this ever needs to become admin-configurable (a DB-backed
// setting instead of a constant), this is the only file that
// needs to change — everywhere else just imports TEACHER_SHARE_PERCENT.

const TEACHER_SHARE_PERCENT = 80; // teacher keeps 80%, platform keeps 20%

const splitAmount = (amountPaid) => {
  const teacherEarning = Math.round((amountPaid * TEACHER_SHARE_PERCENT) / 100 * 100) / 100;
  const platformFee    = Math.round((amountPaid - teacherEarning) * 100) / 100;
  return { teacherEarning, platformFee };
};

module.exports = { TEACHER_SHARE_PERCENT, splitAmount };