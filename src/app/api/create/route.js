import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import db from '../../db';

export async function POST(req) {
  try {
    const requestData = await req.formData();
    const file = requestData.get('fileData');
    const filename = uuidv4() + path.extname(file.name);
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let postId = null;

    // 파일 저장
    await fs.writeFile(filepath, buffer);

    // 데이터베이스에 데이터 삽입
    const insertResult = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO posts (user_id, post, img_path) VALUES (?, ?, ?)',
        [requestData.get('id'), requestData.get('contents'), `/uploads/${filename}`],
        (err, result) => {
          if (err) {
            console.error('데이터 삽입 중 오류 발생:', err);
            reject(err);
          } else {
            console.log('데이터가 성공적으로 삽입되었습니다.');
            resolve(result);
            postId = result.insertId;
          }
        }
      );
    });

    // 해시태그를 관리하는 작업을 수행
    const hashtagsString = requestData.get('hashtags'); // 해시태그 문자열 가져오기

    if (hashtagsString) {
      const hashtagsArray = hashtagsString.split(','); // 문자열을 쉼표로 분할하여 배열로 만듦
      console.log("해쉬태그 배열 ============>", hashtagsArray)
      if (hashtagsArray.length > 0) {
        try {
          for (const hashtag of hashtagsArray) {
            const trimmedHashtag = hashtag.trim(); // 해시태그 양 끝의 공백 제거
            if (trimmedHashtag) {
                db.query(
                'INSERT INTO post_hashtag (posts_no, hashtag) VALUES (?, ?)',
                [postId, trimmedHashtag]
              );
              console.log('해시태그 데이터가 성공적으로 삽입되었습니다.');
            }
          }
        } catch (err) {
          console.error('해시태그 데이터 삽입 중 오류 발생:', err);
        }
      }
    }

    return NextResponse.json({ message: '데이터가 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('POST 요청 처리 중 오류 발생:', error);
    return NextResponse.error('데이터를 처리할 수 없습니다.', 500);
  }
}
