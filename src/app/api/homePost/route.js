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

  let sqlQuery = `
  SELECT p.posts_no, u.user_id, post, img_path, posts_date, user_nickname, user_score, profile_img_path, hashtags, like_no, bookmark_no
  FROM posts p 
  LEFT JOIN user u ON u.user_id = p.user_id
  LEFT JOIN profile f ON u.user_id = f.user_id 
  LEFT JOIN (SELECT posts_no, GROUP_CONCAT(hashtag SEPARATOR ', ') AS hashtags
  FROM post_hashtag GROUP BY posts_no) hs ON hs.posts_no=p.posts_no 
  LEFT JOIN likepost lk ON lk.posts_no = p.posts_no
  LEFT JOIN bookmark bk ON bk.posts_no = p.posts_no
  ORDER BY posts_date DESC
  `;
  
  console.log("req.query ==> ", param1);
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(sqlQuery, (err, results) => {
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