import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, User, Calendar, FileText, Upload, X, Loader2 } from 'lucide-react';
import { Company, VehicleData, DriverData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleFormProps {
  company: Company;
  onBack: () => void;
  onSubmit: (vehicle: VehicleData, driver: DriverData, validTill?: string, purpose?: string) => void;
}

const vehicleTypes = ['Truck', 'Van', 'Tanker', 'Container', 'Flatbed', 'Bus', 'Car', 'Motorcycle'];

export const VehicleForm = ({ company, onBack, onSubmit }: VehicleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Vehicle fields
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePhoto, setVehiclePhoto] = useState<string | undefined>();

  // Driver fields
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [driverPhoto, setDriverPhoto] = useState<string | undefined>();

  // Optional fields
  const [validTill, setValidTill] = useState('');
  const [purpose, setPurpose] = useState('');

  const vehiclePhotoRef = useRef<HTMLInputElement>(null);
  const driverPhotoRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!driverName.trim()) newErrors.driverName = 'Driver name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!licenseId.trim()) newErrors.licenseId = 'License ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSubmit(
      { vehicleNumber: vehicleNumber.toUpperCase(), vehicleModel, vehicleType, vehiclePhoto },
      { driverName, phoneNumber, licenseId, driverPhoto },
      validTill || undefined,
      purpose || undefined
    );

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                style={{ backgroundColor: `${company.color}15` }}
              >
                {company.icon}
              </div>
              <span className="font-medium text-foreground">{company.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Generate Vehicle QR Code</h1>
          <p className="text-muted-foreground mb-8">Enter vehicle and driver details to create a secure verification QR code</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Details */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Vehicle Details</h2>
                  <p className="text-sm text-muted-foreground">Information about the vehicle</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="e.g., MH12AB1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className={errors.vehicleNumber ? 'border-destructive' : ''}
                  />
                  {errors.vehicleNumber && <p className="text-xs text-destructive">{errors.vehicleNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="e.g., Tata Prima 4928"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className={errors.vehicleModel ? 'border-destructive' : ''}
                  />
                  {errors.vehicleModel && <p className="text-xs text-destructive">{errors.vehicleModel}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className={errors.vehicleType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicleType && <p className="text-xs text-destructive">{errors.vehicleType}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Photo (Optional)</Label>
                  <input
                    type="file"
                    ref={vehiclePhotoRef}
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, setVehiclePhoto)}
                    className="hidden"
                  />
                  {vehiclePhoto ? (
                    <div className="relative group">
                      <img src={vehiclePhoto} alt="Vehicle" className="h-24 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setVehiclePhoto(undefined)}
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => vehiclePhotoRef.current?.click()}
                      className="h-24 w-full border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">Upload Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Driver Details */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Driver Details</h2>
                  <p className="text-sm text-muted-foreground">Information about the driver</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name *</Label>
                  <Input
                    id="driverName"
                    placeholder="Full name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className={errors.driverName ? 'border-destructive' : ''}
                  />
                  {errors.driverName && <p className="text-xs text-destructive">{errors.driverName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., +91 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={errors.phoneNumber ? 'border-destructive' : ''}
                  />
                  {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseId">License ID *</Label>
                  <Input
                    id="licenseId"
                    placeholder="Driving license number"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    className={errors.licenseId ? 'border-destructive' : ''}
                  />
                  {errors.licenseId && <p className="text-xs text-destructive">{errors.licenseId}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Driver Photo (Optional)</Label>
                  <input
                    type="file"
                    ref={driverPhotoRef}
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, setDriverPhoto)}
                    className="hidden"
                  />
                  {driverPhoto ? (
                    <div className="relative group">
                      <img src={driverPhoto} alt="Driver" className="h-24 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setDriverPhoto(undefined)}
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => driverPhotoRef.current?.click()}
                      className="h-24 w-full border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">Upload Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Details */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Additional Details</h2>
                  <p className="text-sm text-muted-foreground">Optional information</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="validTill" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Valid Until
                  </Label>
                  <Input
                    id="validTill"
                    type="date"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="purpose">Purpose / Remarks</Label>
                  <Textarea
                    id="purpose"
                    placeholder="e.g., Delivery to warehouse, Client pickup, etc."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gradient-primary text-primary-foreground border-0 min-w-[160px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate QR Code'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};
