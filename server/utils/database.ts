// server/utils/database.ts
import { Pool } from 'pg'

// El pool usa la cadena de conexión del .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}
