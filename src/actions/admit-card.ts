'use server'

/**
 * Admit Card Server Actions
 * Handles admit card verification and data retrieval with full center venue details
 * Includes resilient memory fallback for zero-downtime execution
 */

import { connectToDatabase, Student } from '@/lib/mongodb'
import { admitCardSchema } from '@/lib/validations'
import { AdmitCardData } from '@/lib/types'
import { getCenterMetadataByName } from '@/lib/proximity'
import { getAdmitCardMemory } from '@/lib/memory-store'

export async function getAdmitCard(
  rollNumber: string,
  dob: string
): Promise<{ success: boolean; data?: AdmitCardData; message?: string }> {
  const cleanRollNo = rollNumber.trim().toUpperCase()
  const cleanDob = dob.trim()

  const validation = admitCardSchema.safeParse({ rollNumber: cleanRollNo, dob: cleanDob })
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message || 'Invalid roll number or date of birth.',
    }
  }

  try {
    await connectToDatabase()

    const dobDate = new Date(cleanDob)
    dobDate.setHours(0, 0, 0, 0)
    const dobEnd = new Date(dobDate)
    dobEnd.setDate(dobEnd.getDate() + 1)

    const student = await Student.findOne({
      roll_no: cleanRollNo,
      dob: {
        $gte: dobDate,
        $lt: dobEnd,
      },
    })
      .populate('allotted_center_id', 'name code location city location_order')
      .lean()

    if (!student) {
      throw new Error('Not found in MongoDB')
    }

    const formattedDob =
      student.dob instanceof Date
        ? student.dob.toISOString().split('T')[0]
        : String(student.dob).split('T')[0]

    const allottedDoc: any = student.allotted_center_id
    const centerName = allottedDoc?.name || student.selected_center || 'Main Exam Center'
    const meta = getCenterMetadataByName(centerName)

    const centerCode = allottedDoc?.code || meta?.code || 'CEN-01'
    const centerLocation = allottedDoc?.location || meta?.location || 'Designated Examination Center'
    const centerCity = allottedDoc?.city || meta?.city || centerName

    const rawSignature = `${student.roll_no}-${student.email}-${centerCode}-EMS2026`
    const verificationHash = Buffer.from(rawSignature)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 16)
      .toUpperCase()

    const admitCardData: AdmitCardData = {
      student: {
        name: student.name,
        roll_no: student.roll_no || cleanRollNo,
        dob: formattedDob,
        email: student.email,
        mobile: student.mobile,
      },
      center: {
        name: centerName,
        code: centerCode,
        location: centerLocation,
        city: centerCity,
      },
      exam: {
        date: process.env.NEXT_PUBLIC_EXAM_DATE || '15th March 2026',
        time: '10:00 AM - 1:00 PM (IST)',
        reportingTime: '08:30 AM',
        gateClosingTime: '09:30 AM',
      },
      reallocated: Boolean(student.was_reallocated),
      preferred_center: student.preferred_center || student.selected_center,
      verificationHash,
    }

    return {
      success: true,
      data: admitCardData,
    }
  } catch (error) {
    const memCard = getAdmitCardMemory(cleanRollNo, cleanDob)
    if (memCard) {
      return {
        success: true,
        data: memCard,
      }
    }

    return {
      success: false,
      message: 'No admit card found matching the provided Roll Number and Date of Birth. Please verify your credentials.',
    }
  }
}
