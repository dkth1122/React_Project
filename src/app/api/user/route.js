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
  console.log("req.query ==> ", param1);
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM user', (err, results) => {
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

export async function POST(req) {
  try {
    // 클라이언트로부터 전송된 JSON 데이터를 파싱합니다.
    const requestData = await req.json();

    // 데이터베이스에 데이터를 삽입 또는 업데이트하는 작업을 수행합니다.
    // 예시: 데이터베이스에 "user" 테이블에 데이터 추가
    const insertResult = await new Promise((resolve, reject) => {
      db.query('INSERT INTO user (user_id, user_pw, user_name, user_phone, user_nickname) VALUES (?, ?, ?, ?, ?)', [requestData.id, requestData.pw, requestData.name, requestData.phone, requestData.nickname], (err, result) => {
        if (err) {
          console.error('데이터 삽입 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('데이터가 성공적으로 삽입되었습니다.');
          resolve(result);
          alert("회원 가입 완료");
          
        }
      });

      db.query('INSERT INTO profile (user_id, profile_img_path, bio) VALUES (?, ?, ?)', [requestData.id, '/expImg.png', '바이오를 추가하세요.'], (err, result) => {
        if (err) {
          console.error('데이터 삽입 중 오류 발생:', err);
        } else {
          console.log('데이터가 성공적으로 삽입되었습니다.');
        }
      });
    });

    
    db.query('INSERT INTO score_rank (user_id) VALUES (?)', [requestData.id], (err, result) => {
      if (err) {
        console.error('데이터 삽입 중 오류 발생:', err);
      } else {
        console.log('데이터가 성공적으로 삽입되었습니다.');
      }
    });

    return NextResponse.json({ message: '데이터가 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('POST 요청 처리 중 오류 발생:', error);
    return NextResponse.error('데이터를 처리할 수 없습니다.', 500);
  }
}
export async function PUT(req) {
  try {
    // 클라이언트로부터 UPDATE 요청을 받으면 데이터를 업데이트합니다.
    // 예시: 데이터베이스에서 특정 ID에 해당하는 데이터를 업데이트

    const updatedData = await req.json(); // 클라이언트가 전달한 업데이트할 데이터

    // 데이터 업데이트 작업
    const updateResult = await new Promise((resolve, reject) => {
      db.query('UPDATE user SET name = ? WHERE id = ?', [updatedData.value2, updatedData.value1], (err, result) => {
        if (err) {
          console.error('데이터 업데이트 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('데이터가 성공적으로 업데이트되었습니다.');
          resolve(result);
        }
      });
    });

    return NextResponse.json({ message: '데이터가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('PUT 요청 처리 중 오류 발생:', error);
    return NextResponse.error('데이터를 업데이트할 수 없습니다.', 500);
  }
}
export async function DELETE(req) {
  try {
    // 클라이언트로부터 DELETE 요청을 받으면 데이터를 삭제합니다.
    // 예시: 데이터베이스에서 특정 ID에 해당하는 데이터를 삭제
    const deleteData = await req.json(); 
    // 데이터 삭제 작업
    const deleteResult = await new Promise((resolve, reject) => {
      db.query('DELETE FROM user WHERE id = ?', [deleteData.value1], (err, result) => {
        if (err) {
          console.error('데이터 삭제 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('데이터가 성공적으로 삭제되었습니다.');
          resolve(result);
        }
      });
    });

    return NextResponse.json({ message: '데이터가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('DELETE 요청 처리 중 오류 발생:', error);
    return NextResponse.error('데이터를 삭제할 수 없습니다.', 500);
  }
}