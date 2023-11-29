"use client"
import React, { useState } from 'react';
import styled from '@emotion/styled';
import MenuBar from '../MenuBar';
import Cookies from 'js-cookie';
import 'react-image-crop/dist/ReactCrop.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form``;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 12px 20px;
  margin: 0 0 20px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
`;

const SocialShare = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const SocialIcon = styled.div`
  color: #fff;
  background-color: #3b5998;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: #4c70ba;
  }
`;

export default function EditProfile() {
  // 파일 전송
  const [fileData, setFileData] = useState(null);

  const onUpload = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };
  

  // 데이터 DB로 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    let id = Cookies.get('id');
    const bio = e.target.bio.value;
    const nick = e.target.nick.value;

     // 모든 필드가 비어있는 경우
  if (fileData === null && nick === '' && bio === '') {
    alert('변경 사항이 없습니다.');
    return; // 함수 종료
  }


    // FormData 객체 생성
    const formData = new FormData();

    formData.append('id', id);

    if (fileData !== null) {
      formData.append('fileData', fileData);
    }
    if (nick !== '') {
      formData.append('nick', nick);
    }

    if (bio !== '') {
      formData.append('bio', bio);
    }
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        // 업로드 성공 처리
        console.log('업로드 성공:', response.statusText);
      } else {
        // 업로드 실패 처리
        console.error('업로드 실패:', response.status);
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      // 오류 처리
    }
  };

  return (
    <div className="plusSquareAll">
      <Container>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="file-input">프로필 이미지
          <Input type="file" id="file-input" accept="image/*,video/*" onChange={onUpload}></Input></Label>
          
          <Label htmlFor="contents">닉네임:
          <input type="text" id="contents" placeholder="닉네임 입력" name='nick'/></Label>

          <Label htmlFor="contents">바이오:
          <input type="text" id="contents" placeholder="바이오 입력" name='bio' /></Label>
          
          <div><button type="submit" style={{
                                background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                color: 'transparent', // 글자 색상을 투명으로 설정
                                border: 'none', // 테두리 없애기
                                cursor: 'pointer', // 커서 스타일 변경
                                fontSize: '18px',
                                marginTop : '10px',
                                marginLeft: '230px'
                           }}>저장</button></div>
        </Form>
      </Container>
      <MenuBar />
    </div>
  );
}
