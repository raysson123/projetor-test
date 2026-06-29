import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { User, Mail, Phone, Calendar, Save, Edit } from 'lucide-react';

const ProfileManager = () => {
  const { profile, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!profile) return;

    const result = await updateProfile({
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim()
    });

    if (result.success) {
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } else {
      toast.error(result.error?.message || 'Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || ''
    });
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando perfil...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Meu Perfil</span>
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email (não editável) */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Label>
          <Input
            value={profile.email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">O email não pode ser alterado</p>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Nome Completo</span>
          </Label>
          {isEditing ? (
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Seu nome completo"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {profile.full_name || 'Não informado'}
            </div>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Telefone</span>
          </Label>
          {isEditing ? (
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {profile.phone || 'Não informado'}
            </div>
          )}
        </div>

        {/* Tipo de conta */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Tipo de Conta</span>
          </Label>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              profile.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {profile.role === 'admin' ? 'Administrador' : 'Aluno'}
            </span>
          </div>
        </div>

        {/* Data de criação */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Membro desde</span>
          </Label>
          <div className="p-3 bg-gray-50 rounded-md">
            {new Date(profile.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Botões de ação */}
        {isEditing && (
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Salvando...' : 'Salvar'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileManager; 