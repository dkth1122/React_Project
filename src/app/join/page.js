"use client"
import React, { useState, useEffect } from 'react';

export default function Join() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    pw: '',
    pwCheck: '',
    nickname: '',
    name: '',
    phone: '',
  });
  const { id, pw, pwCheck, nickname, name, phone } = formData;
  const param1 = "test";

  // 아이디는 영문자, 숫자, 언더스코어(_)만 허용하고 15자 이하여야 함
  const idRegex = /^[a-zA-Z0-9_]{1,15}$/;
  // 비밀번호는 최소 8자 이상, 20자 이하, 대문자, 소문자, 숫자, 특수 문자(!@#$%^&* 등)를 포함해야 함
  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,20}$/;
  // 이름은 한글 또는 영문 대소문자만 허용하고 10글자 이하여야 함
  const nameRegex = /^[가-힣a-zA-Z]{1,10}$/;
  // 전화번호는 숫자만 허용하고 12자 이하여야 함
  const phoneRegex = /^[0-9]{1,12}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!id || !pw || !pwCheck || !nickname || !name || !phone) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }

    // 정규식 검증
    if (!idRegex.test(id)) {
      alert('아이디는 영문자, 숫자, 언더스코어(_)로 이루어져야 하며 15자 이하여야 합니다.');
      return;
    }
    if (!pwRegex.test(pw)) {
      alert('비밀번호는 최소 8자 이상, 20자 이하, 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다.');
      return;
    }
    if (pw !== pwCheck) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (!nameRegex.test(name)) {
      alert('이름은 한글 또는 영문 대소문자로 이루어져야 하며 10글자 이하여야 합니다.');
      return;
    }
    if (!phoneRegex.test(phone)) {
      alert('전화번호는 숫자로 이루어져야 하며 12자 이하여야 합니다.');
      return;
    }

    const jsonMap = JSON.stringify(formData);

    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonMap,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버 응답이 실패했습니다.');
        }
        return response.json(); 
      })
      .then((data) => {
        console.log('서버 응답:', data);
        alert('회원 가입 성공! ');
        location.href='/';
      })
      .catch((error) => {
        console.error('POST 요청 중 오류 발생:', error);
      });
  };

  return (
    <div  style={{
      width:'300px',
      margin:'100px auto',
      backgroundColor:'white',
      padding:'100px',
      paddingTop:'-50px',
      boxShadow:'0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      textAlign:'center',
  
    }}>
      <h1>회원 가입</h1>

      <form onSubmit={handleSubmit}>
        <div><input type="text" name="id" placeholder="아이디" value={id} onChange={handleChange} className='joinInput' /></div>
        <div><input type="password" name="pw" placeholder="비밀번호" value={pw} onChange={handleChange}  className='joinInput' /></div>
        <div><input type="password" name="pwCheck" placeholder="비밀번호확인" value={pwCheck} onChange={handleChange} className='joinInput'  /></div>
        <div><input type="text" name="nickname" placeholder="닉네임" value={nickname} onChange={handleChange} className='joinInput'  /></div>
        <div><input type="text" name="name" placeholder="이름" value={name} onChange={handleChange} className='joinInput'  /></div>
        <div><input type="text" name="phone" placeholder="번호" value={phone} onChange={handleChange} className='joinInput'  /></div>
        <div><button type='submit' style={{
                                 background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                 WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                 color: 'transparent', // 글자 색상을 투명으로 설정
                                 border: 'none', // 테두리 없애기
                                 cursor: 'pointer', // 커서 스타일 변경
                                 fontSize: '24px',
                                 marginTop:'20px',
                                 fontSize:'24px'
                }}>저장</button></div>
      </form>
    </div>
  );
}
