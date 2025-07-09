import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResellers } from '@/hooks/useResellers';
import { Reseller } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

// Customização visual (mock local)
const defaultCustom = {
  logo: '/nd-logo.svg',
  homeTitle: 'Localizador de Unidades',
  homeSubtitle: 'Encontre nossa unidade mais próxima',
  btnBuscar: 'Buscar Unidades',
  selectEstado: 'Selecione o estado',
  selectCidade: 'Todas as cidades',
};

interface FormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  position: [number, number];
  type: 'Sede Principal' | 'Unidade Regional';
  website: string;
  description: string;
  photo?: string;
  coverageRadius?: number;
  showCoverage?: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { resellers, loading, error, addReseller, updateReseller, deleteReseller } = useResellers();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    position: [-18.5833, -46.5167],
    type: 'Unidade Regional',
    website: '',
    description: '',
    photo: undefined,
    coverageRadius: 100,
    showCoverage: false
  });
  const [custom, setCustom] = useState(() => {
    const saved = localStorage.getItem('nddrones_custom');
    return saved ? JSON.parse(saved) : defaultCustom;
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Salvar customização local
  const saveCustom = (data: any) => {
    setCustom(data);
    localStorage.setItem('nddrones_custom', JSON.stringify(data));
  };

  // Upload de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        saveCustom({ ...custom, logo: ev.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de foto para unidade
  const handlePhotoChange = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateReseller(id, { photo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      position: [-18.5833, -46.5167],
      type: 'Unidade Regional',
      website: '',
      description: '',
      photo: undefined,
      coverageRadius: 100,
      showCoverage: false
    });
    setEditingReseller(null);
  };

  const handleEdit = (reseller: Reseller) => {
    setEditingReseller(reseller);
    setFormData({
      name: reseller.name,
      address: reseller.address,
      phone: reseller.phone,
      email: reseller.email,
      position: reseller.position,
      type: reseller.type,
      website: reseller.website || '',
      description: reseller.description || '',
      photo: reseller.photo || undefined,
      coverageRadius: reseller.coverageRadius || 100,
      showCoverage: reseller.showCoverage || false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingReseller) {
        await updateReseller(editingReseller.id, {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          position: formData.position,
          type: formData.type as 'Sede Principal' | 'Unidade Regional',
          website: formData.website || undefined,
          description: formData.description || undefined,
          photo: formData.photo || undefined,
          coverageRadius: formData.coverageRadius || undefined,
          showCoverage: formData.showCoverage || false,
        });
        toast({
          title: "Sucesso!",
          description: "Unidade atualizada com sucesso.",
        });
      } else {
        await addReseller(formData);
        toast({
          title: "Sucesso!",
          description: "Nova unidade adicionada com sucesso.",
        });
      }
      
      resetForm();
      setIsDialogOpen(false);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar unidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReseller(id);
      toast({
        title: "Sucesso!",
        description: "Unidade removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover unidade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nd-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nd-green-dark mx-auto mb-4"></div>
          <p className="text-nd-green-dark font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Moderno */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-nd-green-dark rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2L13,8L12,14L11,8L12,2M12,2C13.66,2 15,3.34 15,5C15,6.66 13.66,8 12,8C10.34,8 9,6.66 9,5C9,3.34 10.34,2 12,2M6,8C7.66,8 9,9.34 9,11C9,12.66 7.66,14 6,14C4.34,14 3,12.66 3,11C3,9.34 4.34,8 6,8M18,8C19.66,8 21,9.34 21,11C21,12.66 19.66,14 18,14C16.34,14 15,12.66 15,11C15,9.34 16.34,8 18,8M12,16C13.66,16 15,17.34 15,19C15,20.66 13.66,22 12,22C10.34,22 9,20.66 9,19C9,17.34 10.34,16 12,16Z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-500 text-sm">Gerenciar unidades ND Drones</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{resellers.length} unidades ativas</span>
              </div>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Voltar ao Mapa</span>
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com configurações */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total de Unidades</span>
                    <span className="font-semibold text-gray-900">{resellers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sede Principal</span>
                    <span className="font-semibold text-green-600">
                      {resellers.filter(r => r.type === 'Sede Principal').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unidades Regionais</span>
                    <span className="font-semibold text-orange-600">
                      {resellers.filter(r => r.type === 'Unidade Regional').length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Personalização da Home */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                    </svg>
                    Personalização da Home
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Logo da Empresa</Label>
                    <div className="mt-2">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={custom.logo} 
                          alt="Logo atual" 
                          className="w-12 h-12 object-contain border rounded"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Título Principal</Label>
                    <Input
                      value={custom.homeTitle}
                      onChange={(e) => saveCustom({...custom, homeTitle: e.target.value})}
                      placeholder="Ex: Localizador de Unidades"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subtítulo</Label>
                    <Input
                      value={custom.homeSubtitle}
                      onChange={(e) => saveCustom({...custom, homeSubtitle: e.target.value})}
                      placeholder="Ex: Encontre nossa unidade mais próxima"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Texto do Botão Buscar</Label>
                    <Input
                      value={custom.btnBuscar}
                      onChange={(e) => saveCustom({...custom, btnBuscar: e.target.value})}
                      placeholder="Ex: Buscar Unidades"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Placeholder Estado</Label>
                    <Input
                      value={custom.selectEstado}
                      onChange={(e) => saveCustom({...custom, selectEstado: e.target.value})}
                      placeholder="Ex: Selecione o estado"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Placeholder Cidade</Label>
                    <Input
                      value={custom.selectCidade}
                      onChange={(e) => saveCustom({...custom, selectCidade: e.target.value})}
                      placeholder="Ex: Todas as cidades"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configurações de Contato */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp e Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Número do WhatsApp</Label>
                    <Input
                      value={custom.whatsappNumber || ''}
                      onChange={(e) => saveCustom({...custom, whatsappNumber: e.target.value})}
                      placeholder="Ex: 5511999999999"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: código do país + DDD + número (sem espaços ou símbolos)
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mensagem Padrão WhatsApp</Label>
                    <Textarea
                      value={custom.whatsappMessage || ''}
                      onChange={(e) => saveCustom({...custom, whatsappMessage: e.target.value})}
                      placeholder="Ex: Olá! Gostaria de saber mais sobre os serviços da ND Drones."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showWhatsapp"
                      checked={custom.showWhatsapp !== false}
                      onChange={(e) => saveCustom({...custom, showWhatsapp: e.target.checked})}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded"
                    />
                    <Label htmlFor="showWhatsapp" className="text-sm text-gray-700">
                      Exibir botão flutuante do WhatsApp
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Configurações Avançadas */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                    </svg>
                    Configurações Avançadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tipo de Mapa Padrão</Label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="mapType"
                          value="traditional"
                          checked={custom.mapType === 'traditional'}
                          onChange={(e) => saveCustom({...custom, mapType: e.target.value})}
                          className="w-4 h-4 text-nd-green-dark border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Tradicional</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="mapType"
                          value="satellite"
                          checked={custom.mapType === 'satellite'}
                          onChange={(e) => saveCustom({...custom, mapType: e.target.value})}
                          className="w-4 h-4 text-nd-green-dark border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Satélite</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showCoverageByDefault"
                      checked={custom.showCoverageByDefault || false}
                      onChange={(e) => saveCustom({...custom, showCoverageByDefault: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <Label htmlFor="showCoverageByDefault" className="text-sm text-gray-700">
                      Mostrar círculos de cobertura por padrão
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enableDarkMode"
                      checked={custom.enableDarkMode || false}
                      onChange={(e) => saveCustom({...custom, enableDarkMode: e.target.checked})}
                      className="w-4 h-4 text-gray-600 border-gray-300 rounded"
                    />
                    <Label htmlFor="enableDarkMode" className="text-sm text-gray-700">
                      Habilitar modo escuro por padrão
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Personalização de Cores */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>
                    </svg>
                    Cores Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Cor Principal</Label>
                    <div className="flex items-center space-x-3 mt-1">
                      <input
                        type="color"
                        value={custom.primaryColor || '#1B2A1A'}
                        onChange={(e) => saveCustom({...custom, primaryColor: e.target.value})}
                        className="w-10 h-8 border border-gray-300 rounded"
                      />
                      <Input
                        value={custom.primaryColor || '#1B2A1A'}
                        onChange={(e) => saveCustom({...custom, primaryColor: e.target.value})}
                        placeholder="#1B2A1A"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Cor Secundária</Label>
                    <div className="flex items-center space-x-3 mt-1">
                      <input
                        type="color"
                        value={custom.secondaryColor || '#F2994A'}
                        onChange={(e) => saveCustom({...custom, secondaryColor: e.target.value})}
                        className="w-10 h-8 border border-gray-300 rounded"
                      />
                      <Input
                        value={custom.secondaryColor || '#F2994A'}
                        onChange={(e) => saveCustom({...custom, secondaryColor: e.target.value})}
                        placeholder="#F2994A"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Header da seção principal */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Unidades</h2>
                  <p className="text-gray-600">Gerencie todas as unidades ND Drones</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        resetForm();
                        setIsDialogOpen(true);
                      }}
                      className="bg-nd-green-dark hover:bg-nd-green-light text-white flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Nova Unidade</span>
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-2xl font-bold text-nd-green-dark flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingReseller ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                        </svg>
                        {editingReseller ? 'Editar Unidade' : 'Adicionar Nova Unidade'}
                      </DialogTitle>
                      <p className="text-gray-600 mt-1">
                        {editingReseller ? 'Atualize as informações da unidade' : 'Preencha os dados da nova unidade'}
                      </p>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-nd-green-dark mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                            </svg>
                            Informações Básicas
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome da Unidade *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="mt-1"
                                placeholder="Ex: ND Drones - Belo Horizonte"
                              />
                            </div>
                            <div>
                              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Tipo *</Label>
                              <Select value={formData.type} onValueChange={(value: 'Sede Principal' | 'Unidade Regional') => setFormData({...formData, type: value})}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Sede Principal">Sede Principal</SelectItem>
                                  <SelectItem value="Unidade Regional">Unidade Regional</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Label htmlFor="address" className="text-sm font-medium text-gray-700">Endereço Completo *</Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                              required
                              className="mt-1"
                              placeholder="Rua, número, bairro, cidade, estado"
                            />
                          </div>
                        </div>

                        {/* Contato */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-nd-green-dark mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                            </svg>
                            Informações de Contato
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefone *</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                required
                                className="mt-1"
                                placeholder="(11) 99999-9999"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                className="mt-1"
                                placeholder="contato@unidade.com.br"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Localização */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-nd-green-dark mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z"/>
                            </svg>
                            Coordenadas GPS
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude *</Label>
                              <Input
                                id="latitude"
                                type="number"
                                step="any"
                                value={formData.position[0]}
                                onChange={(e) => setFormData({...formData, position: [parseFloat(e.target.value) || 0, formData.position[1]]})}
                                required
                                className="mt-1"
                                placeholder="-20.9467"
                              />
                            </div>
                            <div>
                              <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude *</Label>
                              <Input
                                id="longitude"
                                type="number"
                                step="any"
                                value={formData.position[1]}
                                onChange={(e) => setFormData({...formData, position: [formData.position[0], parseFloat(e.target.value) || 0]})}
                                required
                                className="mt-1"
                                placeholder="-49.2958"
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Utilize o Google Maps para obter as coordenadas precisas da unidade
                          </p>
                        </div>

                        {/* Configurações de Cobertura */}
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-nd-green-dark mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                            </svg>
                            Configurações de Cobertura
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="coverageRadius" className="text-sm font-medium text-gray-700">
                                Raio de Cobertura (km) *
                              </Label>
                              <Input
                                id="coverageRadius"
                                type="number"
                                min="1"
                                max="500"
                                value={formData.coverageRadius || 100}
                                onChange={(e) => setFormData({...formData, coverageRadius: parseInt(e.target.value) || 100})}
                                className="mt-1"
                                placeholder="100"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Defina o raio de cobertura em quilômetros (1-500 km)
                              </p>
                            </div>

                            <div className="flex items-center space-x-3">
                              <input
                                id="showCoverage"
                                type="checkbox"
                                checked={formData.showCoverage || false}
                                onChange={(e) => setFormData({...formData, showCoverage: e.target.checked})}
                                className="w-4 h-4 text-nd-green-dark border-gray-300 rounded focus:ring-nd-green-dark"
                              />
                              <Label htmlFor="showCoverage" className="text-sm font-medium text-gray-700">
                                Mostrar círculo de cobertura no mapa por padrão
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-nd-green-dark mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                            </svg>
                            Informações Adicionais
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website (opcional)</Label>
                              <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => setFormData({...formData, website: e.target.value})}
                                className="mt-1"
                                placeholder="https://nddrones.com.br"
                              />
                            </div>

                            <div>
                              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição (opcional)</Label>
                              <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                                className="mt-1"
                                placeholder="Descrição detalhada da unidade, serviços oferecidos, horário de funcionamento..."
                              />
                            </div>

                            <div>
                              <ImageUpload
                                label="Foto da Unidade (opcional)"
                                value={formData.photo}
                                onChange={(photo) => setFormData({...formData, photo})}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsDialogOpen(false);
                              resetForm();
                            }}
                            className="px-6"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-nd-green-dark hover:bg-nd-green-light text-white px-6"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {editingReseller ? 'Atualizar Unidade' : 'Adicionar Unidade'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Lista de Unidades Modernizada */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Lista de Unidades</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {resellers.map((reseller) => (
                    <div key={reseller.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            reseller.type === 'Sede Principal' ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            <svg className={`w-6 h-6 ${
                              reseller.type === 'Sede Principal' ? 'text-green-600' : 'text-orange-600'
                            }`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2L13,8L12,14L11,8L12,2M12,2C13.66,2 15,3.34 15,5C15,6.66 13.66,8 12,8C10.34,8 9,6.66 9,5C9,3.34 10.34,2 12,2M6,8C7.66,8 9,9.34 9,11C9,12.66 7.66,14 6,14C4.34,14 3,12.66 3,11C3,9.34 4.34,8 6,8M18,8C19.66,8 21,9.34 21,11C21,12.66 19.66,14 18,14C16.34,14 15,12.66 15,11C15,9.34 16.34,8 18,8M12,16C13.66,16 15,17.34 15,19C15,20.66 13.66,22 12,22C10.34,22 9,20.66 9,19C9,17.34 10.34,16 12,16Z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-medium text-gray-900">{reseller.name}</h4>
                              <Badge variant={reseller.type === 'Sede Principal' ? 'default' : 'secondary'} className="text-xs">
                                {reseller.type}
                              </Badge>
                            </div>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                                </svg>
                                <span>{reseller.address}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                                </svg>
                                <span>{reseller.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                                </svg>
                                <span>{reseller.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z"/>
                                </svg>
                                <span>{reseller.position[0]}, {reseller.position[1]}</span>
                              </div>
                              {reseller.coverageRadius && (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                                  </svg>
                                  <span className="text-blue-600 font-medium">
                                    Cobertura: {reseller.coverageRadius}km
                                    {reseller.coveredCities && ` (${reseller.coveredCities.length} cidades)`}
                                  </span>
                                </div>
                              )}
                            </div>
                            {reseller.description && (
                              <p className="mt-2 text-sm text-gray-600 italic">{reseller.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(reseller)}
                            className="flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remover
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover "{reseller.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(reseller.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Confirmar Remoção
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {resellers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2L13,8L12,14L11,8L12,2M12,2C13.66,2 15,3.34 15,5C15,6.66 13.66,8 12,8C10.34,8 9,6.66 9,5C9,3.34 10.34,2 12,2M6,8C7.66,8 9,9.34 9,11C9,12.66 7.66,14 6,14C4.34,14 3,12.66 3,11C3,9.34 4.34,8 6,8M18,8C19.66,8 21,9.34 21,11C21,12.66 19.66,14 18,14C16.34,14 15,12.66 15,11C15,9.34 16.34,8 18,8M12,16C13.66,16 15,17.34 15,19C15,20.66 13.66,22 12,22C10.34,22 9,20.66 9,19C9,17.34 10.34,16 12,16Z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma unidade encontrada</h3>
                    <p className="text-gray-500">Adicione a primeira unidade para começar.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 