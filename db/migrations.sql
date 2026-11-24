CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       varchar NOT NULL UNIQUE,
  password    varchar NOT NULL,
  name        varchar,
  phone       varchar,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name   varchar NOT NULL UNIQUE,
  description varchar,
  created_at  timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TYPE parkings_status_enum AS ENUM ('pending', 'parked', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS parkings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  id_conductor uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plate        varchar NOT NULL,
  description  text,
  datetime     timestamp NOT NULL,
  status       parkings_status_enum NOT NULL DEFAULT 'pending',
  created_at   timestamp NOT NULL DEFAULT now()
);

INSERT INTO roles (role_name, description) VALUES
  ('admin', 'Administrador'),
  ('supervisor', 'Supervisor'),
  ('conductor', 'Valet que parquea los vehículos'),
  ('cliente', 'Dueño del vehículo')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO users (email, password, name) VALUES
  ('admin@test.com', '$scrypt$ln=17,r=8,p=1$dKrwk1b6km7/PAiP2VNO0w$UrwVhOv34iF3MfeRykwjkhFxtgCn5o1Nz2NUzgPI+6g', 'Admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@test.com' AND r.role_name = 'admin'
ON CONFLICT DO NOTHING;


CREATE TYPE reservations_status_enum AS ENUM ('pending', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS reservations (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  id_spot            uuid NOT NULL REFERENCES parkings(id) ON DELETE CASCADE,
  date               timestamp NOT NULL,
  vehicle_plate      varchar NOT NULL,
  vehicle_max_charge float NOT NULL,
  status             reservations_status_enum NOT NULL DEFAULT 'pending',
  created_at         timestamp NOT NULL DEFAULT now()
);
