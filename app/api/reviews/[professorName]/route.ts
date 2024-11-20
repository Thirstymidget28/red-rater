import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db_util';

export async function GET(
  request: Request,
  { params }: { params: { professorName: string } }
) {
  const { professorName } = params;

  if (!professorName) {
    console.error('Professor name is required');
    return NextResponse.json(
      { error: 'Professor name is required' },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();
    console.log('Database connection established');
    const [reviews] = await connection.execute(
      'SELECT * FROM reviews WHERE profName = ?',
      [professorName]
    );
    connection.release();
    console.log('Reviews fetched successfully:', reviews);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}