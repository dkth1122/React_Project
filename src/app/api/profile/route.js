    import { NextResponse } from 'next/server';
    import { promises as fs } from 'fs';
    import path from 'path';
    import { v4 as uuidv4 } from 'uuid';
    import db from '../../db';
    export async function PUT(req) {
        try {
          const requestData = await req.formData();
      
          const file = requestData.get('fileData');
      
          if (file !== null) {
            const filename = uuidv4() + path.extname(file.name);
            const filepath = path.join(process.cwd(), 'public', 'profile', filename);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
      
            // 파일 저장
            await fs.writeFile(filepath, buffer);
          }
      
          // 데이터베이스에 데이터 삽입
          let updateProfileQuery = 'UPDATE profile SET';
          let updateProfileValues = [];
      
          // bio가 존재하면 쿼리에 추가
          if (requestData.get('bio')) {
            updateProfileQuery += ' bio = ?,';
            updateProfileValues.push(requestData.get('bio'));
          }
      
          // img_path가 존재하면 쿼리에 추가
          if (file !== null) {
            updateProfileQuery += ' profile_img_path = ?,';
            updateProfileValues.push(`/profile/${filename}`);
          }
      
          if (updateProfileValues.length > 0) {
            updateProfileQuery = updateProfileQuery.slice(0, -1); // 마지막 쉼표 제거
            updateProfileQuery += ' WHERE user_id = ?';
            updateProfileValues.push(requestData.get('id'));
      
            // 데이터베이스 쿼리 실행
            const updateResult = await new Promise((resolve, reject) => {
              db.query(updateProfileQuery, updateProfileValues, (err, result) => {
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
      
          // nick이 존재하면 user 테이블 업데이트
          if (requestData.get('nick')) {
            let updateNickQuery = 'UPDATE user SET user_nickname = ? WHERE user_id = ?';
            let updateNickValues = [requestData.get('nick'), requestData.get('id')];
      
            // 데이터베이스 쿼리 실행
            await new Promise((resolve, reject) => {
              db.query(updateNickQuery, updateNickValues, (err, result) => {
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
      
          return NextResponse.json({ message: '데이터가 성공적으로 저장되었습니다.' });
        } catch (error) {
          console.error('POST 요청 처리 중 오류 발생:', error);
          return NextResponse.error('데이터를 처리할 수 없습니다.', 500);
        }
      }      