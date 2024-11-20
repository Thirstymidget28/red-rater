import { NextResponse } from 'next/server';
import { getConnection } from './../../../lib/db_util';

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  let name = pathname.split('/').pop();

  if (name) {
    name = decodeURIComponent(decodeURIComponent(name)); // Decode the name parameter twice
    name = name.replace(/ /g, ', '); // Replace space with comma and space
  }

  if (!name) {
    return NextResponse.json({ message: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT Name, SubjectName, Term, \`Course Num\` AS CourseNum, 
           SUM(\`Strongly Agree\` + \`Agree\` + \`Neutral\` + \`Disagree\` + \`Strongly Disagree\`) as Entries,
           ROUND(AVG(CASE WHEN LEFT(Response, 2) = '1.' THEN Average ELSE NULL END), 1) as AvgResponse1,
           ROUND(AVG(CASE WHEN LEFT(Response, 2) = '2.' THEN Average ELSE NULL END), 1) as AvgResponse2,
           ROUND(AVG(CASE WHEN LEFT(Response, 2) = '3.' THEN Average ELSE NULL END), 1) as AvgResponse3,
           ROUND((AVG(CASE WHEN LEFT(Response, 2) = '1.' THEN Average ELSE NULL END) + 
                  AVG(CASE WHEN LEFT(Response, 2) = '2.' THEN Average ELSE NULL END) + 
                  AVG(CASE WHEN LEFT(Response, 2) = '3.' THEN Average ELSE NULL END)) / 3, 1) as OverallRating
    FROM results
    WHERE Name = ?
    GROUP BY Name, SubjectName, Term, \`Course Num\`
    ORDER BY 
      CAST(SUBSTRING_INDEX(Term, ' ', -1) AS UNSIGNED) ASC
      `, [name]);
    console.log(`Data retrieved for name ${name}`);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`Error in /api/professors/${name}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}