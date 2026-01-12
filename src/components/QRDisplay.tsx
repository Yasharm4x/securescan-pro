import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ArrowLeft, Car, User, Calendar, Shield } from 'lucide-react';
import { Company, VehicleData, DriverData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface QRDisplayProps {
  company: Company;
  vehicle: VehicleData;
  driver: DriverData;
  validTill?: string;
  purpose?: string;
  encodedData: string;
  onBack: () => void;
  onNewQR: () => void;
}

export const QRDisplay = ({
  company,
  vehicle,
  driver,
  validTill,
  purpose,
  encodedData,
  onBack,
  onNewQR,
}: QRDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify?data=${encodedData}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    toast({
      title: 'Link copied!',
      description: 'Verification link has been copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${vehicle.vehicleNumber}-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
            <Button onClick={onNewQR} className="gradient-primary text-primary-foreground border-0">
              Generate Another
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 mb-4 border border-success/20">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">QR Code Generated Successfully</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Vehicle Verification QR Code</h1>
          <p className="text-muted-foreground">Scan this QR code to verify vehicle and driver authenticity</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card rounded-xl p-8 flex flex-col items-center"
          >
            <div className="bg-card rounded-xl p-4 mb-6 shadow-lg">
              <QRCodeSVG
                id="qr-code-svg"
                value={verifyUrl}
                size={220}
                level="H"
                includeMargin
                bgColor="white"
                fgColor="#0f172a"
              />
            </div>

            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              This QR code is cryptographically signed and tamper-proof
            </p>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Company */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                  style={{ backgroundColor: `${company.color}15` }}
                >
                  {company.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issued by</p>
                  <p className="font-semibold text-foreground">{company.name}</p>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Car className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground">Vehicle Details</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Number</p>
                  <p className="font-medium text-foreground">{vehicle.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium text-foreground">{vehicle.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{vehicle.vehicleType}</p>
                </div>
              </div>
              {vehicle.vehiclePhoto && (
                <img src={vehicle.vehiclePhoto} alt="Vehicle" className="mt-4 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            {/* Driver */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <User className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground">Driver Details</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{driver.driverName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{driver.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License ID</p>
                  <p className="font-medium text-foreground">{driver.licenseId}</p>
                </div>
              </div>
              {driver.driverPhoto && (
                <img src={driver.driverPhoto} alt="Driver" className="mt-4 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            {/* Validity */}
            {(validTill || purpose) && (
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground">Additional Info</p>
                </div>
                <div className="space-y-3 text-sm">
                  {validTill && (
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className="font-medium text-foreground">{format(new Date(validTill), 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                  {purpose && (
                    <div>
                      <p className="text-muted-foreground">Purpose</p>
                      <p className="font-medium text-foreground">{purpose}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
