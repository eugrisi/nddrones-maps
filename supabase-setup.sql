-- Criar tabela de revendedores/unidades
CREATE TABLE IF NOT EXISTS resellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  position POINT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Sede Principal', 'Unidade Regional')),
  website VARCHAR(255),
  description TEXT,
  photo TEXT, -- Base64 ou URL da imagem
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais das unidades ND Drones
INSERT INTO resellers (name, address, phone, email, position, type, website, description) VALUES
('ND Drones - Sede Principal', 'Monts Azul Paulista, SP', '(11) 99999-9999', 'sede@nddrones.com.br', POINT(-46.7167, -21.1667), 'Sede Principal', 'https://nddrones.com.br', 'Sede principal da ND Drones com atendimento completo e estoque'),
('ND Drones - Espera Feliz', 'Espera Feliz, MG', '(32) 99999-9999', 'esperafeliz@nddrones.com.br', POINT(-41.9167, -20.6500), 'Unidade Regional', 'https://nddrones.com.br', 'Unidade regional com atendimento especializado'),
('ND Drones - Janaúba', 'Janaúba, MG', '(38) 99999-9999', 'janauba@nddrones.com.br', POINT(-43.3167, -15.8000), 'Unidade Regional', 'https://nddrones.com.br', 'Unidade regional com atendimento especializado'),
('ND Drones - Lavras', 'Lavras, MG', '(35) 99999-9999', 'lavras@nddrones.com.br', POINT(-45.0000, -21.2500), 'Unidade Regional', 'https://nddrones.com.br', 'Unidade regional com atendimento especializado'),
('ND Drones - Patos de Minas', 'Patos de Minas, MG', '(34) 99999-9999', 'patosminas@nddrones.com.br', POINT(-46.5167, -18.5833), 'Unidade Regional', 'https://nddrones.com.br', 'Unidade regional com atendimento especializado'),
('ND Drones - Unaí', 'Unaí, MG', '(38) 99999-9999', 'unai@nddrones.com.br', POINT(-46.9167, -16.3667), 'Unidade Regional', 'https://nddrones.com.br', 'Unidade regional com atendimento especializado')
ON CONFLICT DO NOTHING;

-- Habilitar Row Level Security
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read access" ON resellers FOR SELECT USING (true);

-- Política para permitir inserção/atualização/exclusão apenas para usuários autenticados
CREATE POLICY "Allow authenticated users to insert" ON resellers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update" ON resellers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete" ON resellers FOR DELETE USING (auth.role() = 'authenticated'); 