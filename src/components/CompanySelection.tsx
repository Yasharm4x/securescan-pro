import { motion } from 'framer-motion';
import { Shield, Scan, QrCode } from 'lucide-react';
import { companies } from '@/lib/companies';
import { Company } from '@/lib/types';
import { CompanyCard } from '@/components/CompanyCard';

interface CompanySelectionProps {
  onSelectCompany: (company: Company) => void;
}

export const CompanySelection = ({ onSelectCompany }: CompanySelectionProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Enterprise Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
              VeriFlow
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8">
              Secure vehicle & driver verification powered by encrypted QR codes.
              Select your company to get started.
            </p>
            <div className="flex items-center justify-center gap-8 text-primary-foreground/50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                <span className="text-sm">QR Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                <span className="text-sm">Instant Scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">HMAC Signed</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Company Grid */}
      <div className="container mx-auto px-4 -mt-8 pb-16 relative z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">Select Your Company</h2>
          <p className="text-muted-foreground">Choose your organization to access the verification dashboard</p>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              onClick={onSelectCompany}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
