//테이블명 : score_rank
// api 코드 (src/app/api/user/route.js)
// GET => SELECT
// POST => INSERT
// PUT => UPDATE
// DELETE => DELETE 

import { NextResponse } from 'next/server'
import db from '../../db';

export async function GET(req) { 
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM score_rank sc INNER JOIN profile f ON f.user_id = sc.user_id ORDER BY rank_score DESC LIMIT 10', (err, results) => {
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



export async function PUT(req) {

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    const requestData = await req.json();
  
    // 현재 rank_score 값 가져오기
    const getCurrentScoreQuery = 'SELECT rank_score FROM score_rank WHERE user_id = ?';
    const [currentScoreRow] = await new Promise((resolve, reject) => {
      db.query(getCurrentScoreQuery, [userId], (err, results) => {
        if (err) {
          console.error('데이터를 가져오는 중 오류 발생:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  
    const currentScore = currentScoreRow ? currentScoreRow.rank_score : 0;
  
    // rank_score가 현재 값보다 작은 경우에만 업데이트
    if (requestData.score > currentScore) {
      const updateQuery = 'UPDATE score_rank SET rank_score = ? WHERE user_id = ?';
      const updateResult = await new Promise((resolve, reject) => {

        db.query(updateQuery, [requestData.score, userId], (err, result) => {
          if (err) {
            console.error('데이터 업데이트 중 오류 발생:', err);
            reject(err);
          } else {
            console.log('데이터가 성공적으로 업데이트되었습니다.');
            resolve(result);
          }
        });

        db.query('UPDATE user SET user_score = ? WHERE user_id = ?', [requestData.score, userId], (err, result) => {
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
    } else {
      // rank_score가 현재 값보다 크거나 같으면 업데이트하지 않음
      return NextResponse.json({ message: '기존에 등록된 점수보다 더 높은 점수를 기록하여야 업데이트됩니다.' });
    }
  } catch (error) {
    console.error('PUT 요청 처리 중 오류 발생:', error);
    return NextResponse.error('데이터를 업데이트할 수 없습니다.', 500);
  }
}