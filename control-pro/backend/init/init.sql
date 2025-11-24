
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- пользователи 
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) DEFAULT 'Менеджер',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- активности пользователей 
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- проекты 
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  items JSONB, -- [{"name": "бетон", "qty": 2}, ...]
  status VARCHAR(20) DEFAULT 'создан',
  total NUMERIC(10,2) DEFAULT 0,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- отчеты
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- дефекты
CREATE TABLE IF NOT EXISTS defects (
  id SERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  priority VARCHAR(20),
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  photo_url TEXT,
  status VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW()
);

-- комментарии
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- индексы
CREATE INDEX IF NOT EXISTS idx_defects_project_id ON defects(project_id);
CREATE INDEX IF NOT EXISTS idx_defects_assigned_to_id ON defects(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_defects_status ON defects(status);
CREATE INDEX IF NOT EXISTS idx_defects_created_at ON defects(created_at);

CREATE INDEX IF NOT EXISTS idx_comments_defect_id ON comments(defect_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
