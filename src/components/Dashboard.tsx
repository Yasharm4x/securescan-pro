import { motion } from 'framer-motion';
import { LogOut, Plus, History, Shield } from 'lucide-react';
import { Company, QRRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RecentQRCard } from './RecentQRCard';

interface DashboardProps {
  company: Company;
  onLogout: () => void;
  onGenerateNew: () => void;
  recentRecords: QRRecord[];
}

export const Dashboard = ({ company, onLogout, onGenerateNew, recentRecords }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: `${company.color}15` }}
              >
                {company.icon}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{company.name}</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 border border-success/20">
                <Shield className="h-3.5 w-3.5 text-success" />
                <span className="text-xs font-medium text-success">Secure Mode</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Switch Company
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onGenerateNew}
              className="glass-card group relative overflow-hidden rounded-xl p-6 text-left transition-all hover:shadow-card-hover"
            >
              <div className="gradient-primary absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Generate Vehicle QR</h3>
                <p className="text-sm text-muted-foreground">Create a new verification QR code for a vehicle and driver</p>
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <History className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">QR History</h3>
              <p className="text-sm text-muted-foreground mb-3">You have generated {recentRecords.length} QR codes</p>
              <div className="text-2xl font-bold text-foreground">{recentRecords.length}</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Recently Generated QR Codes</h2>
          {recentRecords.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No QR codes yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Generate your first vehicle verification QR code</p>
              <Button onClick={onGenerateNew} className="gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4 mr-2" />
                Generate Now
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentRecords.slice(0, 6).map((record, index) => (
                <RecentQRCard key={record.id} record={record} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};
