import { NextResponse } from 'next/server';

export async function GET() {
  const bridgeUrl = process.env.BRIDGE_URL;

  // Diagnostic temporaire : si BRIDGE_URL n'est pas défini sur ce déploiement,
  // on le sait tout de suite au lieu d'avoir un vague "fetch failed".
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
    // On logue tout côté serveur (visible dans Vercel > Deployments > Functions > Logs)
    console.error('❌ /api/servers a échoué. BRIDGE_URL =', bridgeUrl);
    console.error(err);
    // Et on renvoie la cause précise dans la réponse pour diagnostiquer sans avoir à chercher les logs
    return NextResponse.json({
      error: err.message,
      cause: err.cause ? String(err.cause) : null,
      bridgeUrlUsed: bridgeUrl,
    }, { status: 500 });
  }
}
