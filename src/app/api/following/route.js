// 해당 코드는 테이블명 : user, 컬럼 : id(auto increment), name(varchar)를 대상으로 테스트한 코드
// api 코드 (src/app/api/user/route.js)
// GET => SELECT
// POST => INSERT
// PUT => UPDATE
// DELETE => DELETE 

import { NextResponse } from 'next/server'
import db from '../../db';

export async function GET(req) { 

  // console.log("req.query ==> ", req.query);
  const { searchParams } = new URL(req.url);
  const param1 = searchParams.get('param1');

  let sqlQuery = 'SELECT COUNT(*) AS CNT FROM follow WHERE follower_user_id = ?';
  
  try {
    const followResults = await new Promise((resolve, reject) => {
      db.query(sqlQuery, [param1] ,  (err, followResults) => {
        if (err) {
          console.error('데이터를 가져오는 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('data ==> ', followResults);
          resolve(followResults);
        }
      });
    });
    return NextResponse.json(followResults);
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    return NextResponse.error('데이터를 가져올 수 없습니다.', 500);
  }
}