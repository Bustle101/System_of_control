-- пользователи 
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) DEFAULT 'Менеджер',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- активности пользователей 
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- проекты
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  stage VARCHAR(50) DEFAULT 'новый',
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- отчеты
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- комментарии
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER,
    author_id INTEGER,
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- дефекты
CREATE TABLE IF NOT EXISTS defects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    project_id INTEGER,
    priority VARCHAR(20),
    assigned_to TEXT,
    due_date DATE,
    photo_url TEXT,
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

BEGIN;


ALTER TABLE defects
    RENAME COLUMN assigned_to TO assigned_to_id;


ALTER TABLE defects
    ALTER COLUMN assigned_to_id TYPE INTEGER USING NULLIF(assigned_to_id, '')::INTEGER;

-- внешние ключи
ALTER TABLE defects
    ADD CONSTRAINT fk_defects_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_defects_assignee
        FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL;

-- индексы для ускорения выборок
CREATE INDEX IF NOT EXISTS idx_defects_project_id ON defects(project_id);
CREATE INDEX IF NOT EXISTS idx_defects_assigned_to_id ON defects(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_defects_status ON defects(status);
CREATE INDEX IF NOT EXISTS idx_defects_created_at ON defects(created_at);


-- 2) comments → defects, users
ALTER TABLE comments
    ADD CONSTRAINT fk_comments_defect
        FOREIGN KEY (defect_id) REFERENCES defects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_comments_defect_id ON comments(defect_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);


-- 3) reports → projects (если нужно связать отчёт с проектом)
ALTER TABLE reports
    ADD COLUMN IF NOT EXISTS project_id INTEGER;

ALTER TABLE reports
    ADD CONSTRAINT fk_reports_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

COMMIT;
