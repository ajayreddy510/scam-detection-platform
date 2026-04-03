import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/scam_detection',
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database error', error);
    throw error;
  }
}

export async function initializeDb() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create job submissions table
    await query(`
      CREATE TABLE IF NOT EXISTS job_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        job_title VARCHAR(255),
        company_name VARCHAR(255),
        posting_url TEXT,
        job_description TEXT,
        recruiter_email VARCHAR(255),
        recruiter_phone VARCHAR(20),
        analysis_result JSONB,
        risk_score INTEGER,
        red_flags TEXT[],
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create scam reports table
    await query(`
      CREATE TABLE IF NOT EXISTS scam_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        company_name VARCHAR(255),
        email_used VARCHAR(255),
        phone_number VARCHAR(20),
        report_description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create companies reference table
    await query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        website VARCHAR(255),
        linkedin_url VARCHAR(255),
        verified_email_domain VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        verification_date TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export { pool };
