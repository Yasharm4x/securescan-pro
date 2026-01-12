import { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanySelection } from '@/components/CompanySelection';
import { Dashboard } from '@/components/Dashboard';
import { VehicleForm } from '@/components/VehicleForm';
import { QRDisplay } from '@/components/QRDisplay';
import { VehicleData, DriverData, QRRecord } from '@/lib/types';
import {
  createQRPayload,
  encodePayload,
  getStoredRecords,
  saveRecord,
  generateRecordId,
} from '@/lib/qr-utils';

type View = 'dashboard' | 'form' | 'qr-display';

const Index = () => {
  const { currentCompany, isLoading, selectCompany, clearCompany } = useCompany();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [generatedRecord, setGeneratedRecord] = useState<QRRecord | null>(null);

  const recentRecords = useMemo(() => {
    if (!currentCompany) return [];
    return getStoredRecords(currentCompany.id);
  }, [currentCompany, generatedRecord]);

  const handleGenerateQR = (
    vehicle: VehicleData,
    driver: DriverData,
    validTill?: string,
    purpose?: string
  ) => {
    if (!currentCompany) return;

    const payload = createQRPayload(currentCompany.id, vehicle, driver, validTill, purpose);
    const encodedData = encodePayload(payload);

    const record: QRRecord = {
      id: generateRecordId(),
      companyId: currentCompany.id,
      vehicle,
      driver,
      validTill,
      purpose,
      createdAt: payload.createdAt,
      signature: payload.signature,
      encodedData,
    };

    saveRecord(record);
    setGeneratedRecord(record);
    setCurrentView('qr-display');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentCompany) {
    return <CompanySelection onSelectCompany={selectCompany} />;
  }

  if (currentView === 'form') {
    return (
      <VehicleForm
        company={currentCompany}
        onBack={() => setCurrentView('dashboard')}
        onSubmit={handleGenerateQR}
      />
    );
  }

  if (currentView === 'qr-display' && generatedRecord) {
    return (
      <QRDisplay
        company={currentCompany}
        vehicle={generatedRecord.vehicle}
        driver={generatedRecord.driver}
        validTill={generatedRecord.validTill}
        purpose={generatedRecord.purpose}
        encodedData={generatedRecord.encodedData}
        onBack={() => {
          setGeneratedRecord(null);
          setCurrentView('dashboard');
        }}
        onNewQR={() => {
          setGeneratedRecord(null);
          setCurrentView('form');
        }}
      />
    );
  }

  return (
    <Dashboard
      company={currentCompany}
      onLogout={clearCompany}
      onGenerateNew={() => setCurrentView('form')}
      recentRecords={recentRecords}
    />
  );
};

export default Index;
