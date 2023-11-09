"use client"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ViewPost() {
  const router = useRouter();
  const { posts_no } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    // posts_no를 사용하여 해당 게시물을 조회하는 데이터 로딩 로직을 구현하세요.
    // 예를 들어, API 호출 또는 데이터베이스 쿼리를 사용하여 게시물 데이터를 가져오는 방법을 구현하세요.

    // 가져온 게시물 데이터를 setPost로 설정하세요.
    // setPost({ title: '게시물 제목', content: '게시물 내용' });
  }, [posts_no]);

  if (!post) {
    return <div className="loading">Loading...</div>; // 데이터 로딩 중에는 Loading 메시지를 표시
  }

  return (
    <div className="post-container">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-content">{post.content}</p>
    </div>
  );
}

export default ViewPost;

// CSS 스타일 추가
<style jsx>{`
  .loading {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 20px;
  }

  .post-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }

  .post-title {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .post-content {
    font-size: 1.2rem;
  }
`}</style>;
