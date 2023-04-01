import React, {useEffect, useState} from 'react';
import st from './App.module.css';
import axios from "axios";

function App() {
  const [chats, setChats] = useState([]);
  function getUpdates() {
      const cookie = document.cookie!;
      const split = cookie.split(";");
      let cookie_parsed: any = {};
      // eslint-disable-next-line array-callback-return
      split.map(cookie => {
          cookie_parsed[cookie.split("=")[0]] = cookie.split("=")[1];
      });
      axios.get("/api/chat/getChatUpdates", {
          headers: {
              authorization: cookie_parsed.authorization.replace("%20", " "),
          }
      }).then(res => {
          if (res.data.type === "chat") {
              if (res.data.data) {
                  setChats((prevState) => {
                      return res.data.data.concat(prevState);
                  });
                  getUpdates();
              } else {
                  getUpdates();
              }
          } else if (res.data.type === "update") {
              if (res.data.data) {
                  setChats((prevState) => {
                      const result: any = []
                      prevState.map((state: any) => {
                          res.data.data.map((data: any) => {
                              if (state.id === data.id) {
                                  result.push(data);
                              } else {
                                  result.push(state);
                              }
                          });
                      });
                      return result
                  });
                  getUpdates();
              }
          }
      }).catch(() => {
          getUpdates();
      });
  }
  useEffect(() => {
    const cookie = document.cookie!;
    const split = cookie.split(";");
    let cookie_parsed: any = {};
      // eslint-disable-next-line array-callback-return
    split.map(cookie => {
        cookie_parsed[cookie.split("=")[0]] = cookie.split("=")[1];
    });
    axios.get("/api/chat/get-chats", {
      headers: {
        authorization: cookie_parsed.authorization.replace("%20", " "),
      }
    }).then(res => {
      setChats(res.data.data);
      getUpdates();
    });
  }, []);
  return (
      <div className={st["chat-content"]}>
        <div className={st["chat-head"]}>
          <span className={st["chat-txt"]}>Входящие</span>
        </div>
        <ul className={st["chat-list"]}>
          {chats.map((chat: any, index: number) => {
            return (
                <li className={st["chat-item"]} key={index}>
                  <a href={"/chat/" + chat.id} className={st["chat-link"]}>
                    <img src="/images/chat-logo.svg" alt="" className={st["chat-image"]} />
                    <div className={st["chat-info"]}>
                      <span className={st["chat-user-name"]}>{chat.name}</span>
                      <span className={st["chat-message-notification"]}>{`${chat.notification} новое сообщение`}</span>
                    </div>
                  </a>
                </li>
            )
          })}
        </ul>
      </div>
  );
}

export default App;
