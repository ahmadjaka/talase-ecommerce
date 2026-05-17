const RESERVED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'talase.id',
  'www.talase.id',
  'admin.talase.id',
  'app.talase.id',
  'api.talase.id',
]);

export function resolveSubdomain(hostname: string): string | null {
  const cleanHost = hostname
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split(':')[0]
    .trim();

  if (!cleanHost || RESERVED_HOSTS.has(cleanHost)) {
    return null;
  }

  if (cleanHost.endsWith('.localhost')) {
    const subdomain = cleanHost.replace('.localhost', '');
    return sanitizeSubdomain(subdomain);
  }

  if (cleanHost.endsWith('.talase.id')) {
    const subdomain = cleanHost.replace('.talase.id', '');
    return sanitizeSubdomain(subdomain);
  }

  return null;
}

export function sanitizeSubdomain(value: string): string | null {
  const subdomain = value.toLowerCase().trim();

  if (!subdomain) return null;

  const isValid = /^[a-z0-9-]+$/.test(subdomain);

  if (!isValid) return null;

  return subdomain;
}