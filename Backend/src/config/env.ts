import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before any application component or middleware evaluates
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to current working directory
