INSERT INTO roles (role_name, description) VALUES
  ('admin', 'Administrador'),
  ('supervisor', 'Supervisor')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO users (email, password, name) VALUES
  ('admin@test.com', '$scrypt$ln=17,r=8,p=1$dKrwk1b6km7/PAiP2VNO0w$UrwVhOv34iF3MfeRykwjkhFxtgCn5o1Nz2NUzgPI+6g', 'Admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@test.com' AND r.role_name = 'admin'
ON CONFLICT DO NOTHING;