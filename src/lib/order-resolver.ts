const PROJECT_ID = 'talase-pos';
const API_KEY = 'AIzaSyC1M0GEIE3OxBgZ3Jdv-Ui516uLhRdYdCM';

const FIRESTORE_RUN_QUERY =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
};

function parseValue(value?: FirestoreValue): any {
  if (!value) return null;
  if ('stringValue' in value) return value.stringValue || '';
  if ('integerValue' in value) return Number(value.integerValue || 0);
  if ('doubleValue' in value) return Number(value.doubleValue || 0);
  if ('booleanValue' in value) return value.booleanValue === true;
  if ('timestampValue' in value) return value.timestampValue || '';
  return null;
}

function parseDoc(row: any) {
  const doc = row.document;
  if (!doc) return null;

  const fields = doc.fields || {};
  const id = String(doc.name || '').split('/').pop() || '';

  const data: Record<string, any> = { id };

  Object.keys(fields).forEach((key) => {
    data[key] = parseValue(fields[key]);
  });

  return data;
}

async function runQuery(body: any) {
  const res = await fetch(FIRESTORE_RUN_QUERY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Firestore order query failed:', await res.text());
    return [];
  }

  const json = await res.json();
  return json.map(parseDoc).filter(Boolean);
}

export async function getOnlineOrdersBySubdomain(subdomain: string) {
  if (!subdomain) return [];

  const rows = await runQuery({
    structuredQuery: {
      from: [{ collectionId: 'online_orders' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'subdomain' },
          op: 'EQUAL',
          value: { stringValue: subdomain },
        },
      },
    },
  });

  return rows.sort((a: any, b: any) => {
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

export async function getOnlineOrderItems(orderId: string) {
  if (!orderId) return [];

  return runQuery({
    structuredQuery: {
      from: [{ collectionId: 'online_order_items' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'orderId' },
          op: 'EQUAL',
          value: { stringValue: orderId },
        },
      },
    },
  });
}

export async function getOnlineOrderByCode(orderCode: string) {
  if (!orderCode) return null;

  const rows = await runQuery({
    structuredQuery: {
      from: [{ collectionId: 'online_orders' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'orderCode' },
          op: 'EQUAL',
          value: { stringValue: orderCode },
        },
      },
      limit: 1,
    },
  });

  return rows[0] || null;
}

export async function getOnlineOrdersByCodes(orderCodes: string[]) {
  const cleanCodes = Array.from(
    new Set(orderCodes.map((e) => String(e || '').trim()).filter(Boolean)),
  ).slice(0, 20);

  const orders = [];

  for (const code of cleanCodes) {
    const order = await getOnlineOrderByCode(code);
    if (order) orders.push(order);
  }

  return orders.sort((a: any, b: any) => {
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}