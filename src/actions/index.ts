/**
 * Server Actions Index
 * Export all server actions from a single file
 */

export { registerStudent, getCenters } from './registration'
export { getAllStudents, getCenterStats, getStudentCount, authenticateAdmin, adminLogin, adminLogout, checkAdminSession } from './admin'
export { getAdmitCard } from './admit-card'
export { sendRegistrationEmail, sendAdmitCardEmail } from './email'
