"use client"
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MenuBar from '../MenuBar';
import Link from 'next/link';
import Popup from '../viewPopup';

const Container = styled.div`
  padding: 20px;
`;

const SearchBar = styled.input`
  display: block;
  width: 100%;
  padding: 12px 20px;
  margin: 0 0 20px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-image: linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9); 
  border-image-slice: 1;
  border-radius: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5,minmax(120px, 1fr));
  grid-gap: 4px;
  
`;

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [popupSrc, setPopupSrc] = useState('');
  const [openPopupParam, setOpenPopupParam] = useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchImages = () => {
    // 검색어를 API에 전달하여 모든 검색 결과를 가져옵니다.
    fetch(`/api/search?param1=${searchQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버 응답이 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  };

  useEffect(() => {
    setPosts([]); // 검색 결과 초기화
    fetchImages(); // 검색 결과 로딩
  }, [searchQuery]);

  const openPopup = (src, param) => {
    setPopupSrc(src);
    setOpenPopupParam(param);
  };

  const closePopup = () => {
    setPopupSrc('');
    setOpenPopupParam(null);
  };

  return (
    <div className='searchAll'>
      <Container>
        <SearchBar
          type="text"
          placeholder="Search for users or hashtags or nickname..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <Grid>
          {posts.map((post, index) => (
            post.posts_no != null ? (
              <Link href='#' key={index} onClick={() => openPopup(post.img_path, post.posts_no)}>
                <img id='postImg' src={post.img_path} style={{ objectFit: 'cover', width: '100%', height: '350px' }} />
              </Link>
            ) : (
              <div key={index}>검색 결과가 없습니다.</div>
            )
          ))}
        </Grid>
        {popupSrc && openPopupParam && (
          <Popup src={popupSrc} onClose={closePopup} param={openPopupParam} />
        )}
      </Container>
      <MenuBar />
    </div>
  );
}