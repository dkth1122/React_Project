import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost', // MySQL 호스트 주소
  user: 'root', // MySQL 사용자 이름
  password: 'test123', // MySQL 비밀번호
  database: 'react', // 사용할 데이터베이스 이름
});
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
  } else {
    console.log('MySQL 데이터베이스에 연결되었습니다.');
  }
});
export default db;