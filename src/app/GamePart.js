
import React from 'react';
import { useState } from 'react';
import Cookies from 'js-cookie'

export default function GamePart({onGameOver}) {
    
    async function rankScore(score) {
        try {
          const userId = Cookies.get('id'); // 쿠키에서 사용자 ID를 가져옵니다.
    
          if (!userId) {
            console.error('사용자 ID를 찾을 수 없습니다.');
            alert('랭크에 점수를 등록하려면 로그인 해주세요.')
            return;
          }
    
          const response = await fetch(`/api/game?userId=${userId}`, { // 사용자 ID를 API URL에 추가합니다.
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ score }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log('점수 전송 성공:', data.message);
          } else {
            console.error('점수 전송 실패:', response.status);
          }
        } catch (error) {
          console.error('점수 전송 오류:', error);
        }
      };



    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    function startGame() {

        if(gameStarted){
            alert("게임이 이미 실행 중입니다. \n일시정지하며, 확인을 누르면 다시 재개됩니다.")
            return;
        }
        // .game 요소 내부의 캔버스와 버튼을 가져옴
        let gameContainer = document.querySelector('#myGameAll');
        let canvas = gameContainer.querySelector('#canvas');
        let startButton = gameContainer.querySelector('#startButton');
        let ctx = canvas.getContext('2d');

        setGameStarted(true);

        // Canvas 크기 조절
        canvas.width = 1500; // 100%
        canvas.height = 300; // 고정된 높이

        let dino = {
            x: 100,
            y: 200,
            width: 30,
            height: 30,
            velocityY: 0,
            jumping: false,
            jumpCount: 0, // 점프 횟수 추가
            maxJumpCount: 2, // 최대 점프 횟수 설정
            score: 0, // 점수 추가
            draw() {
                ctx.fillStyle = 'green';
                ctx.drawImage(charImg, this.x, this.y);
            }
        }

        const characterImages = ['/d1.png', '/d2.png', '/d3.png', '/d4.png',  '/d1.png',  '/d2.png', '/d3.png', '/d4.png'];
        let currentImageIndex = 0; // 현재 이미지 인덱스

        function changeCharacterImage() {
            // 이미지 인덱스를 증가시키고, 배열 길이로 나눠 순환
            currentImageIndex = (currentImageIndex + 1) % characterImages.length;

            // 현재 이미지 인덱스에 해당하는 이미지를 불러와 charImg.src를 업데이트
            charImg.src = characterImages[currentImageIndex];
          }
        
        let charImg = new Image();
          charImg.src = '/d1.png';
        
        let objectImg = new Image();
        objectImg.src = '/object.png';

        class Cactus {
            constructor() {
                this.x = canvas.width;
                this.y = 200;
                this.width = 30;
                this.height = 30;
            }
            draw() {
                ctx.fillStyle = 'red';
                ctx.drawImage(objectImg, this.x, this.y);
            }
        }

        let timer = 0;
        let cactusArray = [];
        let animation;

        let gravity = 0.2;
        // 초당 점수 증가 간격 설정
        let scoreInterval = 100; // 0.1초마다 1점 증가

        function frameCode() {
            animation = requestAnimationFrame(frameCode);
            timer++; 

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 최소 간격과 최대 간격 설정
            const minInterval = 100;
            const maxInterval = 200;
            // 최소 간격 설정
            const minDistance = 150;
            
            // 랜덤한 간격으로 Cactus 생성
            if (timer % (Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval) === 0) {
                if (cactusArray.length === 0 || canvas.width - cactusArray[cactusArray.length - 1].x >= minDistance) {
                    let cactus = new Cactus();
                    cactusArray.push(cactus);
                }
            }
            
            cactusArray = cactusArray.filter(cactus => cactus.x >= 0);
            cactusArray.forEach(a => {
                a.x -= 5; // 선인장의 이동 속도 증가
                collisionCheck(dino, a);
                a.draw();
            });
            
            // 점프 및 중력 적용
            if (dino.jumping && dino.jumpCount < dino.maxJumpCount) {
                //점프 중
                if (dino.y > 200) {
                    dino.velocityY = -8;
                }
                if (dino.y <= 40) {
                    dino.velocityY = 8;
                }
                dino.y += dino.velocityY;
                //떨어질때
            } else if (dino.y < 200) {
                dino.velocityY = 8;
                dino.y += dino.velocityY;
                if (dino.y >= 200) {
                    dino.y = 200;
                    dino.jumpCount = 0;
                }
            }
            
            dino.draw();
            
            // 이미지 변경 주기 설정 (예: 100프레임당 한 번)
            const imageChangeInterval = 4;
            
            // 이미지 변경 주기에 따라 이미지 변경
            if (timer % imageChangeInterval === 0) {
                changeCharacterImage();
            }
            
            
            // 초당 점수 증가
            if (timer % scoreInterval === 0) {
                dino.score++;
            }

            // 화면에 점수 출력
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${dino.score}`, 10, 30);
        }

        function collisionCheck(dino, cactus) {
            let xCollision = Math.max(0, Math.min(dino.x + dino.width, cactus.x + cactus.width) - Math.max(dino.x, cactus.x));
            let yCollision = Math.max(0, Math.min(dino.y + dino.height, cactus.y + cactus.height) - Math.max(dino.y, cactus.y));

            if (xCollision > 0 && yCollision > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animation);
                setScore(dino.score);
                setGameStarted(false); 
                onGameOver(dino.score);
                alert(`Game Over. 점수 : ${dino.score} \n 랭크는 최고 기록만 등록할 수 있습니다.`);
                rankScore(dino.score); 
            }
        }

        document.addEventListener('keydown', function (e) {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !dino.jumping && dino.jumpCount < dino.maxJumpCount) {
                dino.jumping = true;
                dino.velocityY = -8;
                dino.jumpCount++; // 점프 횟수 증가
            }
        });

        document.addEventListener('keyup', function (e) {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                dino.jumping = false;
            }
        });

        frameCode();
    }

    return (
        <div id="myGameAll">
            <canvas id="canvas"></canvas>
            <button id="startButton" onClick={startGame} style={{
                                 background: 'linear-gradient(to right, #63f5ed, #a27eff, #ffa3d9)', // 배경 그라디언트
                                 WebkitBackgroundClip: 'text', // 글자 색상 투명으로 설정
                                 color: 'transparent', // 글자 색상을 투명으로 설정
                                 border: 'none', // 테두리 없애기
                                 cursor: 'pointer', // 커서 스타일 변경
                                 fontSize: '24px'
                }}>{gameStarted ? '일시정지' : 'Start'}</button>
            <div id="pauseMessage">일시 정지 중</div>
        </div>
    )
}
