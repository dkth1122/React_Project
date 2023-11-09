// 해당 코드는 테이블명 : user, 컬럼 : id(auto increment), name(varchar)를 대상으로 테스트한 코드
// api 코드 (src/app/api/user/route.js)
// GET => SELECT
// POST => INSERT
// PUT => UPDATE
// DELETE => DELETE 

import { NextResponse } from 'next/server'
import db from '../../db';


export async function GET(req) { 
  const { searchParams } = new URL(req.url);
  const param1 = searchParams.get('param1');

  let sqlQuery = 'SELECT * FROM posts p LEFT JOIN bookmark bk ON p.posts_no = bk.posts_no LEFT JOIN user u ON p.user_id = u.user_id LEFT JOIN profile f ON u.user_id = f.user_id WHERE bk.user_id = ?'

  console.log("req.query ==> ", param1);
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(sqlQuery, [param1] ,  (err, results) => {
        if (err) {
          console.error('데이터를 가져오는 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('data ==> ', results);
          resolve(results);
        }
      });
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    return NextResponse.error('데이터를 가져올 수 없습니다.', 500);
  }
}


// 북마크 버튼 토글 API
export async function POST(req) {
  try {
    // 클라이언트로부터 전송된 JSON 데이터를 파싱합니다.
    const requestData = await req.json();
    const { userId, post } = requestData;

    // 데이터베이스에서 해당 데이터를 검색합니다.
    const searchResult = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM bookmark WHERE user_id = ? AND posts_no = ?', [userId, post], (err, result) => {
        if (err) {
          console.error('데이터 검색 중 오류 발생:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (searchResult.length > 0) {
      // 이미 데이터가 있는 경우, 삭제 쿼리를 실행합니다.
      const deleteResult = await new Promise((resolve, reject) => {
        db.query('DELETE FROM bookmark WHERE user_id = ? AND posts_no = ?', [userId, post], (err, result) => {
          if (err) {
            console.error('데이터 삭제 중 오류 발생:', err);
            reject(err);
          } else {
            console.log('데이터가 성공적으로 삭제되었습니다.');
            resolve(result);
          }
        });
      });
    } else {
      // 데이터가 없는 경우, 삽입 쿼리를 실행합니다.
      const insertResult = await new Promise((resolve, reject) => {
        db.query('INSERT INTO bookmark (user_id, posts_no) VALUES (?, ?)', [userId, post], (err, result) => {
          if (err) {
            console.error('데이터 삽입 중 오류 발생:', err);
            reject(err);
          } else {
            console.log('데이터가 성공적으로 삽입되었습니다.');
            resolve(result);
          }
        });
      });
    }

    return NextResponse.json({ message: '데이터가 성공적으로 처리되었습니다.' });
  } catch (error) {
    console.error('POST 요청 처리 중 오류 발생:', error);
    return NextResponse.error('데이터를 처리할 수 없습니다.', 500);
  }
}
