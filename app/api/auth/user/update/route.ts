import { NextResponse } from 'next/server'; // Middleware api for managing HTTP responses.
import { verify } from 'argon2'; // Password comparison function
import { signJWT } from '../../../../lib/jwt'; // Import the signJWT function
import { getConnection } from '../../../../lib/db_util'; // Database utility
import { RowDataPacket, FieldPacket } from 'mysql2/promise'; // Import RowDataPacket and FieldPacket

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  fname: string;
  lname: string;
}

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Retrieve user from the database
    const connection = await getConnection();
    const [rows, fields]: [User[], FieldPacket[]] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

    // Log the fields for debugging purposes
    console.log(fields);

    if (rows.length === 0) { // If the table is empty
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    // Verify the password
    const isPasswordValid = await verify(user.password_hash, password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a JWT token after successful login
    const token = await signJWT({ userId: user.id, email: user.email, fname: user.fname, lname: user.lname });

    // Return the token as an HTTP-only cookie
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set the 'secure' flag for production
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week expiration
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Error during login' }, { status: 500 });
  }
}