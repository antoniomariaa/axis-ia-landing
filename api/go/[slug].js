const { createClient } = require('@supabase/supabase-js');

// Un QR físico ya impreso no puede romperse por un problema de infraestructura:
// cualquier error, credencial faltante o slug desconocido cae acá.
const FALLBACK_URL = 'https://axisai.space/';

module.exports = async (req, res) => {
  // Sin esto, el CDN de Vercel o el navegador podrían cachear el 302 y un cambio
  // de destination_url en Supabase tardaría en reflejarse.
  res.setHeader('Cache-Control', 'no-store');

  const { slug } = req.query;
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!slug || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('qr redirect: faltan variables de entorno SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY');
    }
    res.writeHead(302, { Location: FALLBACK_URL });
    return res.end();
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from('qr_redirects')
      .select('destination_url')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('qr redirect: lookup falló:', error.message);
    }

    const destination = data && data.destination_url ? data.destination_url : FALLBACK_URL;
    res.writeHead(302, { Location: destination });
    return res.end();
  } catch (err) {
    console.error('qr redirect: excepción en el lookup:', err.message);
    res.writeHead(302, { Location: FALLBACK_URL });
    return res.end();
  }
};
