import { NextResponse } from 'next/server';
import db from './../../util/db_util';

export async function GET() {
  try {
    const connection = await db();
    const [rows] = await connection.execute('SELECT DISTINCT Name FROM results');
    console.log("Data retrieved from database:", rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error in /api/professors:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
