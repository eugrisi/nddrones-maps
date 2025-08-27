import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Reseller } from '@/data/mockData';

export const useResellers = () => {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResellers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('resellers')
        .select('*');
      
      if (error) {
        console.warn('Erro ao carregar do Supabase, usando dados mockados:', error);
        // Fallback to mock data
        const { mockResellers } = await import('@/data/mockData');
        setResellers(mockResellers);
      } else {
        // Transform Supabase data to match our interface
        const transformedData: Reseller[] = data.map(item => ({
          id: item.id,
          name: item.name,
          address: item.address,
          phone: item.phone,
          email: item.email,
          position: [item.position_lat, item.position_lng] as [number, number],
          type: item.type,
          website: item.website,
          description: item.description,
        }));
        setResellers(transformedData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      // Fallback to mock data
      const { mockResellers } = await import('@/data/mockData');
      setResellers(mockResellers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResellers();
  }, []);

  const addReseller = async (reseller: Omit<Reseller, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('resellers')
        .insert([{
          name: reseller.name,
          address: reseller.address,
          phone: reseller.phone,
          email: reseller.email,
          position_lat: reseller.position[0],
          position_lng: reseller.position[1],
          type: reseller.type,
          website: reseller.website,
          description: reseller.description,
        }])
        .select();
      
      if (error) throw error;
      
      // Transform and add to local state
      const transformedData: Reseller = {
        id: data[0].id,
        name: data[0].name,
        address: data[0].address,
        phone: data[0].phone,
        email: data[0].email,
        position: [data[0].position_lat, data[0].position_lng] as [number, number],
        type: data[0].type,
        website: data[0].website,
        description: data[0].description,
      };
      
      setResellers(prev => [...prev, transformedData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar revendedor');
      throw err;
    }
  };

  const updateReseller = async (id: number, updates: Partial<Reseller>) => {
    try {
      // Interface para dados de atualização do Supabase
      interface SupabaseUpdateData {
        name?: string;
        address?: string;
        phone?: string;
        email?: string;
        position_lat?: number;
        position_lng?: number;
        type?: string;
        website?: string;
        description?: string;
        photo?: string;
        coverageRadius?: number;
        showCoverage?: boolean;
      }
      
      const updateData: SupabaseUpdateData = { ...updates };
      
      // Transform position if provided
      if (updates.position) {
        updateData.position_lat = updates.position[0];
        updateData.position_lng = updates.position[1];
        delete updateData.position;
      }
      
      const { data, error } = await supabase
        .from('resellers')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Transform and update local state
      const transformedData: Reseller = {
        id: data[0].id,
        name: data[0].name,
        address: data[0].address,
        phone: data[0].phone,
        email: data[0].email,
        position: [data[0].position_lat, data[0].position_lng] as [number, number],
        type: data[0].type,
        website: data[0].website,
        description: data[0].description,
      };
      
      setResellers(prev => prev.map(r => r.id === id ? transformedData : r));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar revendedor');
      throw err;
    }
  };

  const deleteReseller = async (id: number) => {
    try {
      const { error } = await supabase
        .from('resellers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setResellers(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar revendedor');
      throw err;
    }
  };

  return {
    resellers,
    loading,
    error,
    fetchResellers,
    addReseller,
    updateReseller,
    deleteReseller,
  };
};