// lib/bridge.js — Connexion au bot Bumpify (API publique)
const BRIDGE_URL = process.env.BRIDGE_URL || 'http://194.62.248.55:30025';

// Récupérer tous les serveurs du réseau
export async function fetchServers() {
  const res = await fetch(`${BRIDGE_URL}/public/servers`, {
    next: { revalidate: 60 },
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Bridge error: ${res.status}`);
  return res.json();
}

// Compatibilité ancienne API
export const bridge = {
  publicServers: fetchServers,
};
