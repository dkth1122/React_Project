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

export default function PlusSquare() {
  // id 저장
  let id = Cookies.get('id');

  if (!id) {
    alert('로그인 해주세요!')
    location.href = '/login';
  } 
  // 파일 전송
  const [fileData, setFileData] = useState(null);
  // 해시태그 배열
  const [hashtags, setHashtags] = useState([]);
  
  const onUpload = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };
  
  // 해시태그 추가
  const addHashtag = () => {
    const input = document.getElementById('tags');
    let tag = input.value.trim();
  

    // "#"을 자동으로 추가
    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }
    
    if (tag !== '' && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      input.value = '';
    }
  };

  // 해시태그 삭제
  const removeHashtag = (tag) => {
    const updatedHashtags = hashtags.filter((t) => t !== tag);
    setHashtags(updatedHashtags);
  };
  
  // 데이터 DB로 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 먼저 필요한 데이터를 수집
    const contents = e.target.elements.contents.value;
  

     // 해시태그들을 문자열로 변환
    const hashtagsString = hashtags.join(', '); // 해시태그들을 쉼표와 공백으로 구분된 문자열로 변환
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('id', id);
    if (fileData !== null) {
      formData.append('fileData', fileData);
    }
    formData.append('contents', contents);
    formData.append('hashtags', hashtagsString);
    
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 업로드 성공 처리
        console.log('업로드 성공:', response.statusText);
        // 업로드가 성공하면 사용자에게 알림을 표시하거나 다른 동작을 수행
      } else {
        // 업로드 실패 처리
        console.error('업로드 실패:', response.status);
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      // 오류 처리
    }
  };

  const handleSocialShare = (platform) => {
    // Implement social sharing logic here
  };

  return (
    <div className="plusSquareAll">
      <Container>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="file-input">Upload a photo or video:</Label>
          <Input type="file" id="file-input" accept="image/*,video/*" onChange={onUpload}></Input>
          <Label htmlFor="contents"></Label>
          <textarea cols={257} rows={10} type="text" id="contents" placeholder="내용을 입력해주세요." />
          <Label htmlFor="tags" className='hashTagLabel'>HashTag:</Label>
          <Input type="text" id="tags" placeholder="Tag users by their username..." />
          {/* 해시태그를 화면에 표시 */}
          <div>
            {hashtags.map((tag, index) => (
              <span key={index}>
                {tag}
                <button type="button" onClick={() => removeHashtag(tag)} style={{
                                background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                color: 'transparent', // 글자 색상을 투명으로 설정
                                border: 'none', // 테두리 없애기
                                cursor: 'pointer', // 커서 스타일 변경
                                fontSize: '12px',
                                marginTop : '10px',
                           }}>
                  <i><img src='/x-mark.png' className='hashTagRemoveMark'></img></i>
                </button>
              </span>
            ))}
          </div>
          <button type="button" onClick={addHashtag} style={{
                                 background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                 WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                 color: 'transparent', // 글자 색상을 투명으로 설정
                                 border: 'none', // 테두리 없애기
                                 cursor: 'pointer', // 커서 스타일 변경
                                 fontSize:'24px',
                                 marginTop:'24px'
           }}>
            Add Hashtag
          </button>
          <div>
          <button type="submit" style={{
            background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
            WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
            color: 'transparent', // 글자 색상을 투명으로 설정
            border: 'none', // 테두리 없애기
            cursor: 'pointer', // 커서 스타일 변경
            fontSize:'24px',
            margin:'24px 0px'
           }}>Post</button>
        </div>
        </Form>
        <SocialShare>
          <SocialIcon onClick={() => handleSocialShare('facebook')}>
            <FaFacebookF />
          </SocialIcon>
          <SocialIcon onClick={() => handleSocialShare('twitter')}>
            <FaTwitter />
          </SocialIcon>
          <SocialIcon onClick={() => handleSocialShare('instagram')}>
            <FaInstagram />
          </SocialIcon>
        </SocialShare>
      </Container>
      <MenuBar />
    </div>
  );
}
