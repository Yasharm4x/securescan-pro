import { motion } from 'framer-motion';
import { Car, User, Calendar, ExternalLink } from 'lucide-react';
import { QRRecord } from '@/lib/types';
import { format } from 'date-fns';

interface RecentQRCardProps {
  record: QRRecord;
  index: number;
}

export const RecentQRCard = ({ record, index }: RecentQRCardProps) => {
  const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify?data=${record.encodedData}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card rounded-xl p-5 hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{record.vehicle.vehicleNumber}</h4>
            <p className="text-xs text-muted-foreground">{record.vehicle.vehicleModel}</p>
          </div>
        </div>
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{record.driver.driverName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(record.createdAt), 'MMM d, yyyy · h:mm a')}</span>
        </div>
      </div>

      {record.validTill && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Valid until {format(new Date(record.validTill), 'MMM d, yyyy')}
          </span>
        </div>
      )}
    </motion.div>
  );
};
