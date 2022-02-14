/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import axios from "api/axios";
import { Link } from "react-router-dom";
import style from "../../styles/BoardCard.module.scss";

type Props = {
  boardSeq: number;
  title: string;
  createAt: string;
  deadline: string;
  author: string;
  isLike: "true" | "false";
  boardStatus: boolean;
};

function BoardCard({
  boardSeq,
  title,
  createAt,
  deadline,
  author,
  isLike,
  boardStatus,
}: Props) {
  const [isLikeState, setIsLikeState] = useState<boolean>(isLike === "true");
  const onClickLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!boardStatus && !isLikeState) return;
    axios
      .post(
        `/board/favorite`,
        { boardSeq },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        setIsLikeState((prev) => !prev);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("즐겨찾기 등록은 10개까지만 가능합니다.");
        } else {
          console.dir(err);
        }
      });
  };

  if (boardStatus) {
    return (
      <div className={style.container}>
        <Link to={`/board/${boardSeq}`}>
          <div className={style.header}>
            <p>작성자: {author}</p>
            <span onClick={onClickLike}>
              {isLikeState ? (
                <i className="fas fa-bookmark" />
              ) : (
                <i className="far fa-bookmark" />
              )}
            </span>
          </div>
          <div className={style.footer}>마감일: {deadline}</div>
          <div className={style.content}>{title}</div>
        </Link>
      </div>
    );
  }
  return (
    <div className={`${style.container} ${style.deadline}`}>
      <div className={style.header}>
        <p>작성자: {author}</p>
        <span onClick={onClickLike}>
          {isLikeState ? (
            <i className="fas fa-bookmark" />
          ) : (
            <i className="far fa-bookmark" />
          )}
        </span>
      </div>
      <div className={style.footer}>마감</div>
      <div className={style.content}>{title}</div>
    </div>
  );
}

export default BoardCard;
