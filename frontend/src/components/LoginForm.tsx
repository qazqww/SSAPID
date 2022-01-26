import React, { useState, useEffect } from "react";
import axios from "api/axios";
import FacebookSignin from "service/FaceBookSingin";
import GithubSignin from "service/GithubSignin";
import { useNavigate } from "react-router-dom";
import FormHeader from "./layout/FormHeader";
import Input from "./common/Input";
import GoogleSignin from "../service/GoogleSingin";
import style from "../styles/Loginform.module.scss";
import Button from "./common/Button";
// eslint-disable-next-line import/order

function LoginForm() {
  const idPlaceHolder = "아이디를 입력하세요";
  const passwordPlaceHolder = "비밀번호를 입력하세요";
  const [isEmpty, setEmpty] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: "",
    userPw: "",
  });
  const Submit = () => {
    axios
      .post("/login", form)
      .then((res) => {
        sessionStorage.setItem("userNickname", res.data.userNickname);
        window.location.reload();
        navigate("/");
      })
      .catch((err) => {
        alert("존재하지않는 아이디입니다.");
        console.log(err);
        setForm({
          userId: "",
          userPw: "",
        });
      });
  };

  useEffect(() => {
    if (userId === "" || userPw === "") {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  });

  const { userId, userPw } = form;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className={style.wrapper}>
      <FormHeader text="Login" />
      <Input
        name="userId"
        value={userId}
        onChange={onChange}
        placeHolder={idPlaceHolder}
      />
      <Input
        name="userPw"
        value={userPw}
        onChange={onChange}
        placeHolder={passwordPlaceHolder}
      />
      <h4>
        <a href="../idFind">아이디 찾기 | </a>
        <a href="../passFind">비밀번호 찾기 | </a>
        <a href="../register">회원가입</a>
      </h4>
      <Button
        buttonType="submit"
        Disabled={isEmpty}
        text="로그인"
        handleClick={Submit}
      />
      <div className={style.img}>
        <GithubSignin />
        <GoogleSignin />
        <FacebookSignin />
      </div>
    </div>
  );
}

export default LoginForm;
