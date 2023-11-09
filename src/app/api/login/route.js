import { NextResponse } from 'next/server';
import db from '../../db';

export async function POST(req) {
  const requestData = await req.json();
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE user_id = ? AND user_pw = ?', [requestData.id, requestData.pw], (err, results) => {
        if (err) {
          console.error('데이터를 가져오는 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('로그인 결과 ==> ', results);
          resolve(results);
        }
      });
    });

    if (results.length > 0) {
      // 로그인 성공
      return NextResponse.json({ success: true, message: '로그인 성공' });
    } else {
      // 로그인 실패
      return NextResponse.json({ success: false, message: '로그인 실패' });
    }
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    return NextResponse.error('데이터를 가져올 수 없습니다.', 500);
  }
}
