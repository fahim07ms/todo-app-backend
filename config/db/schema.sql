-- Create users table 
CREATE TABLE IF NOT EXISTS users (
    user_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    pass TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);


-- Create todos Table for storing todo data
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id uuid,
    title VARCHAR(250) NOT NULL,
    description VARCHAR(250),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deadline TIMESTAMPTZ,
    
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create indices on todo id, user id, username, and user id related to todos
CREATE INDEX IF NOT EXISTS idx_todos_id ON todos (id);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users (user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);