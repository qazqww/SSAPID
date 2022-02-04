/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import axios from "api/axios";
import OpenViduSession from "openvidu-react";

class Openvidu extends Component {
  constructor(props) {
    super(props);
    this.OPENVIDU_SERVER_URL = `https://${window.location.hostname}:4443`;
    this.OPENVIDU_SERVER_SECRET = "MY_SECRET";
    this.state = {
      mySessionId: "SessionA",
      myUserName: `OpenVidu_User_${Math.floor(Math.random() * 100)}`,
      token: undefined,
    };

    this.handlerJoinSessionEvent = this.handlerJoinSessionEvent.bind(this);
    this.handlerLeaveSessionEvent = this.handlerLeaveSessionEvent.bind(this);
    this.handlerErrorEvent = this.handlerErrorEvent.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.joinSession = this.joinSession.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  handlerJoinSessionEvent() {
    console.log("Join session");
  }

  handlerLeaveSessionEvent() {
    console.log("Leave session");
    this.setState({
      session: undefined,
    });
  }

  handlerErrorEvent() {
    console.log("Leave session");
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleJoin(e, token) {
    this.setState({
      token,
      session: true,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  getToken() {
    return new Promise((resolve, reject) => {
      axios
        .post("/session")
        .then(({ data }) => {
          console.log(data);
          resolve(data.token);
        })
        .catch((err) => {
          console.dir(err);
        });
    });
  }

  joinSession(event) {
    event.preventDefault();
    if (this.state.mySessionId && this.state.myUserName) {
      this.getToken().then((token) => {
        this.handleJoin(token);
      });
    }
  }

  render() {
    const { mySessionId } = this.state;
    const { myUserName } = this.state;
    const { token } = this.state;
    return (
      <div>
        {this.state.session === undefined ? (
          <div id="join">
            <div id="join-dialog">
              <h1> Join a video session </h1>
              <form onSubmit={this.joinSession}>
                <p>
                  <label>Participant: </label>
                  <input
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={this.handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> Session: </label>
                  <input
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={this.handleChangeSessionId}
                    required
                  />
                </p>
                <p>
                  <input name="commit" type="submit" value="JOIN" />
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div id="session">
            <OpenViduSession
              id="opv-session"
              sessionName={mySessionId}
              user={myUserName}
              token={token}
              joinSession={this.handlerJoinSessionEvent}
              leaveSession={this.handlerLeaveSessionEvent}
              error={this.handlerErrorEvent}
            />
          </div>
        )}
      </div>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behaviour MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  //   getToken() {
  //     return this.createSession(this.state.mySessionId)
  //       .then((sessionId) => this.createToken(sessionId))
  //       .catch((Err) => console.error(Err));
  //   }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(`${this.OPENVIDU_SERVER_URL}/openvidu/api/sessions`, data, {
          headers: {
            Authorization: `Basic ${btoa(
              `OPENVIDUAPP:${this.OPENVIDU_SERVER_SECRET}`
            )}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          const error = { ...response };
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              `No connection to OpenVidu Server. This may be a certificate error at ${this.OPENVIDU_SERVER_URL}`
            );
            if (
              window.confirm(
                `No connection to OpenVidu Server. This may be a certificate error at "${this.OPENVIDU_SERVER_URL}"\n\nClick OK to navigate and accept it. ` +
                  `If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${this.OPENVIDU_SERVER_URL}"`
              )
            ) {
              window.location.assign(
                `${this.OPENVIDU_SERVER_URL}/accept-certificate`
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({});
      axios
        .post(
          `${this.OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
          data,
          {
            headers: {
              Authorization: `Basic ${btoa(
                `OPENVIDUAPP:${this.OPENVIDU_SERVER_SECRET}`
              )}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}

export default Openvidu;
