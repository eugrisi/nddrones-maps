# Configuração do Projeto ND Drones

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jtkttlahkanvjjhufcvm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0a3R0bGFoa2FudmpqaHVmY3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTM1MzEsImV4cCI6MjA2NzU4OTUzMX0.kQg19MOMHcq2FU-GIpf0NLV-15dgtqHAu6T5IXk4lj4

# App Configuration
VITE_APP_TITLE=ND Drones - Localizador de Unidades
VITE_APP_DESCRIPTION=Sistema de localização das unidades da ND Drones
```

### 2. Configuração do Supabase

#### Passo 1: Acesse o Dashboard
1. Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login ou crie uma conta
3. Acesse o projeto: `jtkttlahkanvjjhufcvm`

#### Passo 2: Execute o Script SQL
1. No painel do Supabase, vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo `supabase-setup.sql`
3. Clique em **Run** para executar

#### Passo 3: Verifique a Tabela
1. Vá para **Table Editor**
2. Verifique se a tabela `resellers` foi criada
3. Confirme se os dados das unidades foram inseridos

### 3. Estrutura do Banco de Dados

A tabela `resellers` contém os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único da unidade |
| name | VARCHAR(255) | Nome da unidade |
| address | VARCHAR(500) | Endereço completo |
| phone | VARCHAR(20) | Telefone de contato |
| email | VARCHAR(255) | Email de contato |
| position_lat | DECIMAL(10,8) | Latitude da localização |
| position_lng | DECIMAL(11,8) | Longitude da localização |
| type | VARCHAR(100) | Tipo da unidade (Sede Principal/Unidade Regional) |
| website | VARCHAR(255) | Website da unidade (opcional) |
| description | TEXT | Descrição da unidade (opcional) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm run preview
```

## 📊 Dados das Unidades

O sistema inclui as seguintes unidades:

1. **Monts Azul Paulista (SEDE)**
   - Tipo: Sede Principal
   - Coordenadas: -20.9467, -49.2958

2. **Espera Feliz**
   - Tipo: Unidade Regional
   - Coordenadas: -20.6500, -41.9167

3. **Janaúba**
   - Tipo: Unidade Regional
   - Coordenadas: -15.8000, -43.3167

4. **Lavras**
   - Tipo: Unidade Regional
   - Coordenadas: -21.2500, -45.0000

5. **Patos de Minas**
   - Tipo: Unidade Regional
   - Coordenadas: -18.5833, -46.5167

6. **Unaí**
   - Tipo: Unidade Regional
   - Coordenadas: -16.3667, -46.9000

## 🔍 Funcionalidades Implementadas

### ✅ Concluído
- [x] Integração com Supabase
- [x] Mapa interativo com Leaflet
- [x] Ícones de drone personalizados
- [x] Busca por localização
- [x] Filtros por nome/endereço/tipo
- [x] Interface responsiva
- [x] Loading states
- [x] Tratamento de erros
- [x] Fallback para dados mockados

### 🔄 Em Desenvolvimento
- [ ] Autenticação de usuários
- [ ] Painel administrativo
- [ ] Adição/edição de unidades via interface
- [ ] Geolocalização do usuário
- [ ] Rotas otimizadas

## 🛠️ Troubleshooting

### Erro de Conexão com Supabase
Se o sistema não conseguir conectar ao Supabase:
1. Verifique se as credenciais estão corretas
2. Confirme se a tabela `resellers` existe
3. O sistema usará dados mockados como fallback

### Problemas com o Mapa
Se o mapa não carregar:
1. Verifique a conexão com a internet
2. Confirme se o Leaflet está instalado
3. Verifique se não há bloqueios de CORS

### Erros de Build
Se houver erros durante o build:
1. Execute `npm install` novamente
2. Limpe o cache: `npm run build -- --force`
3. Verifique se todas as dependências estão instaladas

## 📞 Suporte

Para suporte técnico:
- Email: desenvolvimento@nddrones.com.br
- Telefone: (11) 99999-9999
- Horário: Segunda a Sexta, 8h às 18h 