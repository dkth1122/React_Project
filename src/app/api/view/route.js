import { NextResponse } from 'next/server'
import db from '../../db';

export async function GET(req) { 
  const { searchParams } = new URL(req.url);
  const param1 = searchParams.get('param1');

  // 게시글 조회
  let postSqlQuery = `
  SELECT p.posts_no, p.user_id, post, img_path, posts_date, user_nickname, profile_img_path FROM posts p 
  INNER JOIN user u ON u.user_id = p.user_id
  LEFT JOIN profile f ON u.user_id = f.user_id
  WHERE p.posts_no = ?`;

  // 댓글 조회
  let commentSqlQuery = `
    SELECT c.posts_no, c.user_id, comment, user_nickname, profile_img_path FROM comments c
    INNER JOIN user u ON u.user_id = c.user_id
    LEFT JOIN profile f ON u.user_id = f.user_id
    WHERE c.posts_no = ?`;

  try {
    // 게시글 조회
    const postResults = await new Promise((resolve, reject) => {
      db.query(postSqlQuery, [param1], (err, results) => {
        if (err) {
          console.error('게시글 데이터를 가져오는 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('게시글 data ==> ', results);
          resolve(results);
        }
      });
    });

    // 댓글 조회
    const commentResults = await new Promise((resolve, reject) => {
      db.query(commentSqlQuery, [param1], (err, results) => {
        if (err) {
          console.error('댓글 데이터를 가져오는 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('댓글 data ==> ', results);
          resolve(results);
        }
      });
    });

    // 게시글과 댓글 데이터를 합쳐서 반환하거나 필요한 형태로 가공하여 반환합니다.
    const combinedData = {
      post: postResults,
      comments: commentResults,
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    return NextResponse.error('데이터를 가져올 수 없습니다.', 500);
  }
}


//인서트
export async function POST(req) {

  const requestData = await req.formData();

  console.log("pNo======>", requestData.get('pNo'), "아이디======>", requestData.get('userId'),"comm======>",  requestData.get('comm'))

  // 댓글 추가 쿼리 작성
  const addCommentQuery = `
    INSERT INTO comments (posts_no, user_id, comment)
    VALUES (?, ?, ?)
  `;

  try {
    // 댓글 추가
    await new Promise((resolve, reject) => {
      db.query(addCommentQuery, [requestData.get('pNo'), requestData.get('userId'), requestData.get('comm')], (err, results) => {
        if (err) {
          console.error('댓글 추가 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('댓글이 성공적으로 추가되었습니다.');
          resolve();
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('데이터를 추가하는 중 오류 발생:', error);
    return NextResponse.error('댓글을 추가할 수 없습니다.', 500);
  }
}

// GET => SELECT
// POST => INSERT
// PUT => UPDATE
// DELETE => DELETE 
//인서트
export async function DELETE(req) {
  try {
  const deleteData = await req.json(); 

  const deleteResult = await new Promise((resolve, reject) => {
    db.query('DELETE FROM comments WHERE comment_no = ?', [deleteData.cNo], (err, result) => {
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
