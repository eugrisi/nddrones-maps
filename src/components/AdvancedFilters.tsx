import { useState } from 'react';
import { Reseller } from '@/data/mockData';

interface AdvancedFiltersProps {
  resellers: Reseller[];
  onFilterChange: (filtered: Reseller[]) => void;
}

const AdvancedFilters = ({ resellers, onFilterChange }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const regions = [
    { value: 'all', label: 'Todas as Regiões' },
    { value: 'sp', label: 'São Paulo' },
    { value: 'mg', label: 'Minas Gerais' },
  ];

  const types = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'Sede Principal', label: 'Sede Principal' },
    { value: 'Unidade Regional', label: 'Unidade Regional' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'type', label: 'Tipo' },
    { value: 'region', label: 'Região' },
  ];

  const applyFilters = () => {
    let filtered = [...resellers];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(reseller => reseller.type === selectedType);
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(reseller => {
        if (selectedRegion === 'sp') {
          return reseller.address.includes('SP');
        } else if (selectedRegion === 'mg') {
          return reseller.address.includes('MG');
        }
        return true;
      });
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'region':
          return a.address.localeCompare(b.address);
        default:
          return 0;
      }
    });

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedRegion('all');
    setSortBy('name');
    onFilterChange(resellers);
  };

  // Apply filters when any filter changes
  useState(() => {
    applyFilters();
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
        </svg>
        Filtros Avançados
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-64 z-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Unidade
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  applyFilters();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Região
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  applyFilters();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  applyFilters();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 