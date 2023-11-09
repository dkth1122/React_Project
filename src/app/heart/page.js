"use client"
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MenuBar from '../MenuBar';
import Cookies from 'js-cookie';
import Popup from '../viewPopup';
import Link from 'next/link';

const Container = styled.div`
  padding: 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const UserInfo = styled.div``;

const Username = styled.h2`
  margin: 0;
`;

const Bio = styled.p`
  margin: 0;
`;

const Stats = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatItem = styled.li`
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
`;

const StatValue = styled.strong`
  display: block;
`;

const StatLabel = styled.span``;

const EditProfileButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 4px;
`;

const PostTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px;
  font-size: 18px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: ${(props) => (props.active ? '#000' : '#ccc')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};

  &:hover {
    color: #000;
  }
`;

const Posts = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  `;
  
  const Post = styled.img`
  width: 100%;
  border: 2px solid transparent; /* 테두리 스타일 설정, 투명하게 설정 */
  border-image: linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9); /* 선형 그라데이션 테두리 */
  border-image-slice: 1; /* 테두리 이미지 크기 설정 */
  object-fit: cover;
`;
export default function User(){
  let id = Cookies.get('id');

  if (!id) {
    alert('로그인 해주세요!');
    location.href = '/login';
  } 
  
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState([]);
  const [following, setFollowing] = useState([]);
  const [popupSrc, setPopupSrc] = useState(null);
  const [openPopupParam, setOpenPopupParam] = useState(null); 


  const param1 = id;

  // 팝업 열기
  const openPopup = (src, param) => {
    setPopupSrc(src);
    setOpenPopupParam(param);
  };

  // 팝업 닫기
  const closePopup = () => {
    setPopupSrc(null);
    setOpenPopupParam(null);
  };

  useEffect(() => {
    fetch(`/api/like?param1=${param1}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버 응답이 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, [param1]);

  const handleEditProfile = () => {
    // Implement edit profile logic here
  };


  return (
    <div className='userAll'>
      <div className='postTitle'>좋아요 누른 피드 목록</div>
      <Container>

    <PostTabs>
    </PostTabs>
    {activeTab === 'posts' && ( 
      
      <Posts>
       {posts.map((post, index) => (
              post.posts_no != null ? (
                <Link href='#'  key={index}  onClick={(e) => {
                  e.preventDefault(); // 링크 클릭 기본 동작 막기
                  openPopup(post.img_path, post.posts_no);
                  setOpenPopupParam(post.posts_no); // 팝업을 열 때 게시물 번호 설정
                }}>
                  <Post id='postImg' key={index} src={post.img_path} style={{ objectFit: 'cover', width: '100%', height: '350px' }} />
                </Link>
              ) : (
                <div key={index}>작성한 게시글이 없습니다.</div>
              )
            ))}
            {popupSrc && openPopupParam && (
              <Popup src={popupSrc} onClose={() => {
                closePopup();
                setOpenPopupParam(null); // 팝업이 닫힐 때 게시물 번호 초기화
              }} param={openPopupParam} />
            )}
</Posts>
    )}
        {activeTab === 'posts' && posts.length === 0 && (
          <div>좋아요 한 피드가 없습니다.</div>
        )}
  </Container>
  <MenuBar />
</div>
  )
}