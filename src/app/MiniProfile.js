"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function MiniProfile() {
  // 상태 변수를 선언하여 데이터를 저장합니다.
  const [rank, setRank] = useState([]);
  const [posts, setPosts] = useState([{ user_nickname: '', user_score: 0, profile_img_path: '' }]);
  const [follow, setFollow] = useState([]);
  const [following, setFollowing] = useState([]);
  let id = Cookies.get('id');

  const param1 = id;

  useEffect(() => {
    // 게시물 데이터, 팔로우 데이터, 팔로잉 데이터, 게임 데이터 한꺼번에 가져오기
    Promise.all([
      fetch(`/api/post?param1=${param1}`).then((response) => response.json()),
      fetch(`/api/follow?param1=${param1}`).then((response) => response.json()),
      fetch(`/api/following?param1=${param1}`).then((response) => response.json()),
      fetch(`/api/game`).then((response) => response.json()),
    ])
      .then(([postResponse, followResponse, followingResponse, gameResponse]) => {
        setPosts(postResponse);
        setFollow(followResponse);
        setFollowing(followingResponse);
        setRank(gameResponse);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, [param1]);
  

  return (
    <div className="miniProfileAll">
      <div className="miniProfile">
            <img className="profileImg"  src={posts.length > 0 ? posts[0].profile_img_path : '/expImg.png'}  alt="Profile"  ></img>
            <div>{posts.length > 0 ? posts[0].user_nickname : ''}</div>
            
            <span className="profileInfo">
              <span>팔로우 : {following.length > 0  ? following[0].CNT : 0}</span>  <span>팔로워 : {follow.length > 0  ? follow[0].CNT : 0}</span>
            </span>

            <table className='rankTable'>
                <thead>
                    <tr><th>게임 최고 점수</th></tr>
                </thead>
                <tbody>
                    <tr><td>{posts.length > 0 ? posts[0].user_score : 0}</td></tr>
                </tbody>
            </table>
      </div>

      <div className="rank">  
        <img src='/rank.png' className='rankImg'></img>
        <ol>
            {rank.map((rank,index) => (
                <li  key={rank.user_id}>{index+1}위 : <img src={rank.profile_img_path} className='rankProfileImg'></img><div className='rankuserId'> {rank.user_id} </div> <span> <img src='/thumsup.png' className='thumsup'></img>{rank.rank_score}</span></li>
                ))}
            </ol>
      </div>
    </div>
  );
}
