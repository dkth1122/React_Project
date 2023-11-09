import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Popup({ src, onClose, param }) {
  const [comment, setComment] = useState([]);
  const [post, setPost] = useState({});
  const param1 = param;
  const userId = Cookies.get("id");

  useEffect(() => {
    fetch(`/api/view?param1=${param1}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답이 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPost(data.post[0]);
        setComment(data.comments);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      });
  }, [param1]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const pNo = param1;
    const comm = e.target.comm.value;

    if (userId == null) {
      alert("댓글을 작성하려면 로그인을 해주세요.");
      window.location.reload();
      return;
    }

    const formData = new FormData();
    formData.append("pNo", pNo);
    formData.append("userId", userId);
    formData.append("comm", comm);

    const options = {
      method: "POST",
      body: formData,
    };

    fetch(`/api/view`, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error("서버 응답이 실패했습니다.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("댓글이 성공적으로 추가되었습니다.", data);
        alert("등록 완료");
        location.reload();
      })
      .catch((error) => {
        console.error("댓글을 추가하는 중 오류 발생:", error);
      });
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <img src={src} alt="팝업 이미지" className="popImg" />
        <Link href="#" onClick={onClose} className="closePop">
          <img src="/x-mark.png" className="xClose"></img>
        </Link>

        <div className="comments">
          <div className="nameAll">
            {post && Object.keys(post).length > 0 ? (
              <div>
                <div className="user-info">
                  <div className="user-nickname"><img src={post.profile_img_path} className="popProfileImg"></img>{post.user_nickname}</div>
                  {userId !== post.user_id && (
                    <button
                      className="followBtn"
                      onClick={() => {
                        const followId = post.user_id;
                        const requestData = { userId: userId, followId: followId };
                        fetch(`/api/followCheck`, {
                          method: "POST",
                          body: JSON.stringify(requestData),
                        })
                          .then((response) => {
                            if (!response.ok) {
                              throw new Error("서버 응답이 실패했습니다.");
                            }
                            return response.json();
                          })
                          .then((data) => {
                            console.log("서버 응답:", data);
                            alert("팔로우 완료");
                          })
                          .catch((error) => {
                            console.error("팔로우 요청 중 오류 발생:", error);
                          });
                      }}
                    >
                      팔로우
                    </button>
                  )}
                </div>
                <div className="post-content">{post.post}</div>
              </div>
            ) : (
              <div>게시글이 없습니다.</div>
            )}
          </div>
<hr style={{ margin: "0", borderTop: "1px solid #ddd" }}></hr>
          {comment.length > 0 ? (
            comment.map((comm, index) => (
              <ul key={index} className="comment-list">
                <li className="comment-item">
                <img src={post.profile_img_path} className="popProfileImg" /> <div className="popCommUid">{comm.user_id}</div>
                  {userId !== comm.user_id && (
                    <button
                      className="followBtn"
                      onClick={(e) => {
                        if (!userId) {
                          alert("로그인 해주세요!");
                          return;
                        }
                        const followId = comm.user_id;
                        const requestData = { userId: userId, followId: followId };
                        fetch(`/api/followCheck`, {
                          method: "POST",
                          body: JSON.stringify(requestData),
                        })
                          .then((response) => {
                            if (!response.ok) {
                              throw new Error("서버 응답이 실패했습니다.");
                            }
                            return response.json();
                          })
                          .then((data) => {
                            console.log("서버 응답:", data);
                            alert("팔로우 완료");
                          })
                          .catch((error) => {
                            console.error("팔로우 요청 중 오류 발생:", error);
                          });
                      }}
                    >
                      팔로우
                    </button>
                  )}
                </li>
                <li className="commentComm">
                  {comm.comment ? (
                    <span>
                       {comm.comment}
                      <a
                        href="#"
                        onClick={() => {
                          let cNo = comm.comment_no;
                          const deleteData = {
                            cNo: cNo,
                          };
                          fetch(`/api/view`, {
                            method: "DELETE",
                            body: JSON.stringify(deleteData),
                          })
                            .then((response) => {
                              if (!response.ok) {
                                throw new Error("서버 응답이 실패했습니다.");
                              }
                              return response.json();
                            })
                            .then((data) => {
                              console.log("서버 응답:", data);
                              alert("삭제 완료");
                              window.location.reload();
                            })
                            .catch((error) => {
                              console.error("DELETE 요청 중 오류 발생:", error);
                            });
                        }}
                      >
                        <img src="/x-mark.png" className="xMark"></img>
                      </a>
                    </span>
                  ) : (
                    <span>작성된 댓글이 없습니다.</span>
                  )}
                </li>
              </ul>
            ))
          ) : (
            <div>댓글이 없습니다.</div>
          )}
<hr style={{ margin: "0", borderTop: "1px solid #ddd" }}></hr>
          <div className="comment-form">
            {userId && (
              <form onSubmit={handleCommentSubmit}>
                <input type="text" placeholder="댓글을 입력하세요" name="comm" />
                <input
                  type="submit"
                  value="댓글 추가"
                  className="add-comment-btn"
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
