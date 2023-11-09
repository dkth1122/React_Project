"use client"
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Header(){
    const [loggedIn, setLoggedIn] = useState(false);
    // 페이지 로드 시 세션 ID 확인
    useEffect(() => {
        const sessionCookie = Cookies.get('id');
        if (sessionCookie) {
        setLoggedIn(true);
        } else {
        setLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        // 로그아웃 버튼을 누를 때 세션 ID 삭제
        Cookies.remove('id');
        setLoggedIn(false);
        location.href = '/';
      };
    
    return(
        <div>
            <div className="headerAll">
                <span className="headerLogo"><a href="#"><img src="/Logo.png"></img></a></span>
                <span className="headerTopBar">
                    <span>
                        {loggedIn ? (
                            <span>
                            <div className="headerDiv">Notification🌊</div> | <div className="headerDiv">Bottle🍾</div> | <div className="headerDiv">{Cookies.get('id')} 님 환영합니다!</div>
                            <button onClick={handleLogout}  style={{
                                 background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                 WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                 color: 'transparent', // 글자 색상을 투명으로 설정
                                 border: 'none', // 테두리 없애기
                                 cursor: 'pointer' // 커서 스타일 변경
                            }}>로그아웃</button>
                            </span>
                        ) : (
                            <div style={{
                                marginTop:'18px'
                           }}>
                            <button onClick={()=>{
                                location.href = '/login';
                            }} style={{
                                background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                color: 'transparent', // 글자 색상을 투명으로 설정
                                border: 'none', // 테두리 없애기
                                cursor: 'pointer' // 커서 스타일 변경
                           }}>로그인</button>  <span><button onClick={()=>{
                            location.href = '/join';
                        }} style={{
                                background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                color: 'transparent', // 글자 색상을 투명으로 설정
                                border: 'none', // 테두리 없애기
                                cursor: 'pointer' // 커서 스타일 변경
                            }}>회원가입</button> </span>
                            </div>
                        )}
                    </span>
                </span>
            </div>
        </div>
    )
}