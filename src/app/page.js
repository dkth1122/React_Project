"use client"
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MenuBar from './MenuBar';
import GamePart from './GamePart';
import MiniProfile from './MiniProfile';
import Popup from './viewPopup';
import Cookies from 'js-cookie';

const Feed = styled.div`
  margin : 30px 110px;
  float: left;
  width: 50%;
  max-width: 700px;
  padding: 20px 0;
`;

const Post = styled.div`
  background-color: white;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #efefef;
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.span`
  font-weight: 600;
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #efefef;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  margin-right: 15px;
  cursor: pointer;
`;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [score, setScore] = useState(0);
  const [popupSrc, setPopupSrc] = useState(null);
  const [openPopupParam, setOpenPopupParam] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]); // 좋아요한 게시물 목록

  const userId = Cookies.get("id");

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
  };

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
    fetch(`/api/homePost`)
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
  }, []);
  
  //좋아요
  // 좋아요 버튼 클릭 시 호출되는 함수
  const handleLikeClick = (postNo) => {

    if (!userId) {
      alert('로그인 해주세요!');
      return;
    } 

      const requestData = {
      post: postNo,
      userId: userId
      };
      fetch(`/api/like`, {
      method: 'POST',
      body: JSON.stringify(requestData), 
      })
      .then((response) => {
          if (!response.ok) {
          throw new Error('서버 응답이 실패했습니다.');
          }
          return response.json();
      })
      .then((data) => {
          console.log('서버 응답:', data);
          alert("좋아요 완료");
          location.reload();
      })
      .catch((error) => {
          console.error('POST 요청 중 오류 발생:', error);
      });
  };

 //북마크
  // 북마크 버튼 클릭 시 호출되는 함수
  const handleBookmarkClick = (postNo) => {
  
    if (!userId) {
      alert('로그인 해주세요!');
      return;
    } 

    const requestData = {
    post: postNo,
    userId: userId
    };
    fetch(`/api/bookmark`, {
    method: 'POST',
    body: JSON.stringify(requestData), // JSON 형식의 업데이트 데이터
    })
    .then((response) => {
        if (!response.ok) {
        throw new Error('서버 응답이 실패했습니다.');
        }
        return response.json();
    })
    .then((data) => {
        console.log('서버 응답:', data);
        alert("북마크 완료");
        location.reload();
    })
    .catch((error) => {
        console.error('POST 요청 중 오류 발생:', error);
    });

};


  return (
    <div className='homeContainer'>
      <div className='homeAll'>
        <GamePart onGameOver={handleGameOver}></GamePart>
        <Feed>
          {posts.map((post, index) => (
            <Post key={post.posts_no}>
              <PostHeader>
                <User>
                  {post.profile_img_path == null ? (
                    <Avatar src="/expImg.png" />
                  ) : (
                    <Avatar src={post.profile_img_path} />
                  )}
                  <Username>{post.user_id}</Username>
                </User>
              </PostHeader>
                <PostImage src={post.img_path} alt="Post" />
              <div className='postContent'>{post.post}</div>
              <div className='hashTagAll'>{post.hashtags}</div>
              <PostActions>
                <ActionButton onClick={() => handleLikeClick(post.posts_no)}>
                 {post.like_no === null ? '🤍' : '💖'}
                </ActionButton>
                <ActionButton>
                  <a onClick={() => openPopup(post.img_path, post.posts_no)}>💬</a>
                </ActionButton>
                {popupSrc && openPopupParam === post.posts_no && (
                  <Popup src={popupSrc} onClose={closePopup} param={post.posts_no} />
                )}
                <ActionButton onClick={() => handleBookmarkClick(post.posts_no)}>
                 {post.bookmark_no === null ? <img src='/bookmark_empty.png' className='bookmark'></img> : <img src='/bookmark.png' className='bookmark'></img>}
                </ActionButton>
             </PostActions>
            </Post>
          ))}
        </Feed>
        <MiniProfile></MiniProfile>
        <MenuBar />
      </div>
    </div>
  );
}
