package com.ssafy.api.service;

import com.ssafy.api.request.BoardRegisterPostReq;
import com.ssafy.api.request.BoardUpdateReq;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.User;

import java.util.List;

public interface BoardService {
    void createBoard(BoardRegisterPostReq boardRegisterPostReq, User user);
    void deleteBoard(Board board);
    List<Board> getBoardList();
    List<Board> getBoardSearchList(String keyword, String content);
    Board updateBoard(Long boardSeq, BoardUpdateReq boardUpdateReq, User user);
    Board getBoardByBoardSeq(Long boardSeq);
}
