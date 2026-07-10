import { NextResponse } from 'next/server';

// Indispensable : sans ça, Next.js essaie de pré-générer cette route API au
// build, ce qui entre en conflit avec le fetch { cache: 'no-store' }
// ci-dessous et provoque une erreur interne DYNAMIC_SERVER_USAGE piégée par
// le try/catch (d'où le "fetch failed" trompeur qu'on voyait avant).
export const dynamic = 'force-dynamic';

export async function GET() {
  const bridgeUrl = process.env.BRIDGE_URL;

  if (!bridgeUrl) {
    console.error('❌ /api/servers : BRIDGE_URL n\'est pas défini dans les variables d\'environnement de ce déploiement.');
    return NextResponse.json({ error: 'BRIDGE_URL manquant côté serveur (variable d\'environnement non définie sur ce déploiement)' }, { status: 500 });
  }

  try {
    const res = await fetch(`${bridgeUrl}/public/servers`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'bridge_error');
    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ /api/servers a échoué. BRIDGE_URL =', bridgeUrl);
    console.error(err);
    return NextResponse.json({
      error: err.message,
      cause: err.cause ? String(err.cause) : null,
      bridgeUrlUsed: bridgeUrl,
    }, { status: 500 });
  }
}
