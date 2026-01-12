import { useState, useEffect, useCallback } from 'react';
import { Company } from '@/lib/types';
import { getCompanyById } from '@/lib/companies';

const COMPANY_KEY = 'veriflow_current_company';

export const useCompany = () => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem(COMPANY_KEY);
    if (storedId) {
      const company = getCompanyById(storedId);
      if (company) {
        setCurrentCompany(company);
      }
    }
    setIsLoading(false);
  }, []);

  const selectCompany = useCallback((company: Company) => {
    localStorage.setItem(COMPANY_KEY, company.id);
    setCurrentCompany(company);
  }, []);

  const clearCompany = useCallback(() => {
    localStorage.removeItem(COMPANY_KEY);
    setCurrentCompany(null);
  }, []);

  return {
    currentCompany,
    isLoading,
    selectCompany,
    clearCompany,
  };
};
