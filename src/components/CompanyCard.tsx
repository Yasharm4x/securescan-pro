import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
  onClick: (company: Company) => void;
  index: number;
}

export const CompanyCard = ({ company, onClick, index }: CompanyCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(company)}
      className="glass-card-hover group relative w-full rounded-xl p-6 text-left transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${company.color}15` }}
          >
            {company.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              ID: {company.shortName}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 w-0 rounded-b-xl transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: company.color }}
      />
    </motion.button>
  );
};
