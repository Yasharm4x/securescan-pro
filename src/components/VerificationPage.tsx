import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Clock, Car, User, Calendar, Building2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { verifyPayload } from '@/lib/qr-utils';
import { VerificationResult } from '@/lib/types';
import { format } from 'date-fns';

export const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      // Simulate verification delay for UX
      setTimeout(() => {
        const verificationResult = verifyPayload(data);
        setResult(verificationResult);
        setIsLoading(false);
      }, 1000);
    } else {
      setResult({
        isValid: false,
        status: 'invalid',
        message: 'No verification data provided.',
      });
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 animate-pulse-glow">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Verifying...</h2>
          <p className="text-sm text-muted-foreground">Checking authenticity and integrity</p>
        </motion.div>
      </div>
    );
  }

  if (!result) return null;

  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      bgClass: 'bg-success/10',
      borderClass: 'border-success/20',
      textClass: 'text-success',
      gradientClass: 'gradient-success',
      title: 'Verified & Authentic',
    },
    invalid: {
      icon: XCircle,
      bgClass: 'bg-destructive/10',
      borderClass: 'border-destructive/20',
      textClass: 'text-destructive',
      gradientClass: 'gradient-destructive',
      title: 'Invalid QR Code',
    },
    tampered: {
      icon: ShieldAlert,
      bgClass: 'bg-destructive/10',
      borderClass: 'border-destructive/20',
      textClass: 'text-destructive',
      gradientClass: 'gradient-destructive',
      title: 'Tampered Data Detected',
    },
    expired: {
      icon: Clock,
      bgClass: 'bg-warning/10',
      borderClass: 'border-warning/20',
      textClass: 'text-warning',
      gradientClass: 'gradient-warning',
      title: 'Verification Expired',
    },
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Status Banner */}
      <div className={`${config.gradientClass} py-8`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-4">
              <StatusIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">{config.title}</h1>
            <p className="text-primary-foreground/80 max-w-md mx-auto">{result.message}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {result.status !== 'verified' && !result.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card rounded-xl p-8 text-center"
          >
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Verification Failed</h3>
            <p className="text-muted-foreground">
              This QR code could not be verified. Please ensure you're scanning a valid VeriFlow QR code.
            </p>
          </motion.div>
        )}

        {result.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Verification Badge */}
            <div className={`glass-card rounded-xl p-4 border ${config.borderClass} ${config.bgClass}`}>
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${config.textClass}`} />
                <div>
                  <p className={`font-semibold ${config.textClass}`}>{config.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Generated on {format(new Date(result.data.createdAt), 'MMMM d, yyyy · h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style={{ backgroundColor: `${result.data.company.color}15` }}
                >
                  {result.data.company.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issued by</p>
                  <p className="text-lg font-semibold text-foreground">{result.data.company.name}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Car className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground">Vehicle Information</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Registration Number</p>
                  <p className="font-semibold text-foreground text-lg">{result.data.vehicle.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium text-foreground">{result.data.vehicle.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{result.data.vehicle.vehicleType}</p>
                </div>
              </div>
              {result.data.vehicle.vehiclePhoto && (
                <img
                  src={result.data.vehicle.vehiclePhoto}
                  alt="Vehicle"
                  className="mt-4 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Driver Details */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <User className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground">Driver Information</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-semibold text-foreground text-lg">{result.data.driver.driverName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{result.data.driver.phoneNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">License ID</p>
                  <p className="font-medium text-foreground">{result.data.driver.licenseId}</p>
                </div>
              </div>
              {result.data.driver.driverPhoto && (
                <img
                  src={result.data.driver.driverPhoto}
                  alt="Driver"
                  className="mt-4 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Additional Info */}
            {(result.data.validTill || result.data.purpose) && (
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground">Additional Information</p>
                </div>
                <div className="space-y-3 text-sm">
                  {result.data.validTill && (
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className={`font-medium ${result.status === 'expired' ? 'text-warning' : 'text-foreground'}`}>
                        {format(new Date(result.data.validTill), 'MMMM d, yyyy')}
                        {result.status === 'expired' && ' (Expired)'}
                      </p>
                    </div>
                  )}
                  {result.data.purpose && (
                    <div>
                      <p className="text-muted-foreground">Purpose</p>
                      <p className="font-medium text-foreground">{result.data.purpose}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">VeriFlow</span> · Secure Vehicle Verification
          </p>
        </motion.div>
      </main>
    </div>
  );
};
