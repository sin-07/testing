/**
 * Admit Card Page
 * Students can verify and download their admit cards
 */

import { Header, Footer } from '@/components/layout';
import AdmitCardForm from './AdmitCardForm';
import { FileText, CheckCircle, Download } from 'lucide-react';

export default function AdmitCardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Download Admit Card
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Enter your roll number and date of birth to access and download your admit card
            </p>
          </div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold">Enter Roll Number</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enter the roll number you received after registration
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold">Verify Date of Birth</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enter your date of birth for verification
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold">Download PDF</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and download your admit card as PDF
              </p>
            </div>
          </div>

          {/* Form - handles its own state */}
          <AdmitCardForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
