import { Company } from './types';

export const companies: Company[] = [
  {
    id: 'abc-logistics',
    name: 'ABC Logistics',
    shortName: 'ABC',
    color: 'hsl(199 89% 48%)',
    icon: '🚚',
  },
  {
    id: 'xyz-transport',
    name: 'XYZ Transport',
    shortName: 'XYZ',
    color: 'hsl(262 83% 58%)',
    icon: '🚛',
  },
  {
    id: 'swift-cargo',
    name: 'Swift Cargo',
    shortName: 'SWC',
    color: 'hsl(142 76% 36%)',
    icon: '📦',
  },
  {
    id: 'global-fleet',
    name: 'Global Fleet Services',
    shortName: 'GFS',
    color: 'hsl(38 92% 50%)',
    icon: '🌐',
  },
  {
    id: 'prime-movers',
    name: 'Prime Movers Inc',
    shortName: 'PMI',
    color: 'hsl(346 77% 50%)',
    icon: '🏎️',
  },
  {
    id: 'metro-transit',
    name: 'Metro Transit Co',
    shortName: 'MTC',
    color: 'hsl(172 66% 50%)',
    icon: '🚌',
  },
];

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find((c) => c.id === id);
};
