"use client" 
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Login() {
  const [formData, setFormData] = useState({
    id: '',
    pw: '',
  });
  const { id, pw } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 서버에 로그인 요청
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, pw }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버 응답이 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
            console.log('로그인 성공:', data.message);
                Cookies.set('id', id.toString()); // id를 문자열로 저장
                const loginId = Cookies.get('id'); // 쿠키에서 문자열로 가져옴
                alert(`${loginId} 님 환영합니다~`);
                location.href = '/';
        } else {
          console.error('로그인 실패:', data.message);
        }
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  };

  return (
    <div style={{
      width:'300px',
      margin:'200px auto',
      backgroundColor:'white',
      padding:'100px',
      paddingTop:'-50px',
      boxShadow:'0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      textAlign:'center'
    }}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="id"
            placeholder="아이디"
            value={id}
            onChange={handleChange}
            style={{
              marginTop:'5px',
              fontSize:'18px'
         }}
          />
        </div>
        <div>
          <input
            type="password"
            name="pw"
            placeholder="비밀번호"
            value={pw}
            onChange={handleChange}
            style={{
              marginTop:'5px',
              fontSize:'18px'
         }}
          />
        </div>
        <div>
          <button type="submit" style={{
                                 background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                 WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                 color: 'transparent', // 글자 색상을 투명으로 설정
                                 border: 'none', // 테두리 없애기
                                 cursor: 'pointer', // 커서 스타일 변경
                                 fontSize: '24px',
                                 marginTop:'20px',
                                 fontSize:'24px'
                }}>로그인</button>
        </div>
      </form>
    </div>
  );
}
