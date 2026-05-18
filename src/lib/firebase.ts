const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const firestoreRestBaseUrl = projectId
  ? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
  : '';

export async function firestoreRunQuery(
  structuredQuery: Record<string, unknown>,
) {
  if (!firestoreRestBaseUrl) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID belum diisi.');
  }

  const response = await fetch(`${firestoreRestBaseUrl}:runQuery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      structuredQuery,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export function parseFirestoreFields(
  fields: Record<string, any> | undefined,
): Record<string, any> {
  if (!fields) return {};

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseFirestoreValue(value);
  }

  return result;
}

function parseFirestoreValue(value: Record<string, any>): any {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;

  if ('arrayValue' in value) {
    return (value.arrayValue.values ?? []).map((item: Record<string, any>) =>
      parseFirestoreValue(item),
    );
  }

  if ('mapValue' in value) {
    return parseFirestoreFields(value.mapValue.fields);
  }

  return null;
}