-- qr_redirects: mapea un slug corto (impreso en QR) a una URL de destino que se puede
-- cambiar sin reimprimir el QR y sin redeploy del sitio.
--
-- CÓMO CORRER ESTO: pegar completo en el SQL Editor del proyecto de Supabase que YA usa
-- whatsapp-saas (no crear un proyecto nuevo).
--
-- CÓMO CAMBIAR UN DESTINO DESPUÉS (sin deploy, sin reimprimir QR):
--   update qr_redirects set destination_url = 'https://nueva-url', updated_at = now() where slug = 'general';

create table if not exists qr_redirects (
  slug text primary key,
  destination_url text not null,
  updated_at timestamptz not null default now()
);

insert into qr_redirects (slug, destination_url) values
  ('general', 'https://axisai.space/'),
  ('inmobiliarias', 'https://axisai.space/inmobiliarias'),
  ('agentes', 'https://axisai.space/agentes')
on conflict (slug) do nothing;
