import React, { Component, useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../context/AuthContext";




const Chats = () => {
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');
  const chatContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AuthContext);


  useEffect(() => {
    initializeMessages();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      const LastMessage = messages[messages.length - 1];
      console.log('lastmessage is', LastMessage.text);

      if (LastMessage.text !== '您好！请复制粘贴新的影像描述：' && LastMessage.type === 'incoming') {
        setIsLoading(true); // Start loading
        const response = await fetch('http://localhost:3002/run-chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: "/home/junwen/a100TrainedModels/output_bloom_3b_3",
            text: '根据下面一段上腹部CT的影像描述：' + LastMessage.text + '生成一份对应的诊断意见：'
          }),
        });

        const data = await response.json();
        console.log(data);
        setMessages([...messages, { text: '根据以上影像描述，IMIT-GPT生成的诊断意见如下：\n ' + data.response, type: 'outgoing', time: new Date().toLocaleTimeString() }]);
        setIsLoading(false); // End loading
      } else {
        console.log('您好！请复制粘贴新的影像描述： appear more than once')
      }
    };

    fetchData();
  }, [messages]);

  const initializeMessages = () => {
    // Replace this with your actual initial data
    const initialData = [
      { text: '您好！请复制粘贴新的影像描述：', type: 'outgoing', time: '10 min ago' },
      { text: '肝脏形态大小正常；肝内多发低密度灶；无强化；最大约28mm。胆囊形态大小正常；未见异常密度影。脾脏形态大小正常；未见异常密度影。胰腺形态大小正常；未见异常密度影。左肾下极类圆形高密度影；右肾未见异常。腹膜后未见异常增大的淋巴结影。附见右下肺斑结影', type: 'incoming', time: '9 min ago' },
      { text: '根据以上影像描述，IMIT-GPT生成的诊断意见如下：\n 肝多发囊肿可能大；左肾下极复杂囊肿可能大；附见右下肺斑结影。请结合临床及其他相关检查；随诊。', type: 'outgoing', time: '10 min ago' },
      { text: '请把最终定稿的诊断意见复制粘贴并发送此处（以便我们记录该工具对您工作的优化程度，谢谢！）：', type: 'outgoing', time: '9 min ago' },
      { text: '肝脏形态大小正常；肝脏实质密度降低；低于脾脏。胆囊腔内密度增高。脾脏形态大小未见明显异常；内部未见异常密度。胰腺形态大小未见明显异常；内部未见异常密度。双侧肾上腺未见明显异常。双肾见类圆形低密度影；大者直径约19mm；部分边缘见高密度影。左肾见小类圆形稍高密度影。后腹膜未见明显增大的淋巴结。', type: 'incoming', time: '9 min ago' },
      { text: '您好！请复制粘贴新的影像描述：', type: 'outgoing', time: '10 min ago' },

      // Add more messages here
    ];


    setMessages(initialData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle the submit here
    console.log('Button clicked' + event.target.value);

    if (textareaValue.replace(/\s+/g, ' ').trim() !== '') {
      setMessages([...messages, { text: textareaValue.replace(/\s+/g, ' ').trim(), type: 'incoming', time: new Date().toLocaleTimeString() }]);
    }

    setTextareaValue('')

  }

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'c') {
      console.log('Control + C was pressed');
      setMessages([...messages, { text: '您好！请复制粘贴新的影像描述：', type: 'outgoing', time: new Date().toLocaleTimeString() }]);
      // Handle the key combination here
      setTextareaValue('')
    } else if (event.key === 'Enter' && textareaValue.replace(/\s+/g, ' ').trim() !== '') {
      console.log('Enter key was pressed');
      if (textareaValue !== '') {
        setMessages([...messages, { text: textareaValue.replace(/\s+/g, ' ').trim(), type: 'incoming', time: new Date().toLocaleTimeString() }]);
      }

      setTextareaValue('')
    } else if (event.key === 'Enter' && textareaValue.replace(/\s+/g, ' ').trim() === '') {
      event.preventDefault();
      setTextareaValue('')
    }

  }

  const menuStatus = showChatMenu ? "slide" : "hide";
  return (
    <div style={{ overflowY: 'auto' }} >
      <div className="row " style={{ overflowY: 'auto', height: 'calc(100vh - 21vh)', width: '101%' }} >
        <div className=" bg-dark" style={{ height: 'calc(100vh - 36vh)' }}  >
          <div className="card chat-app-wrapper" style={{ overflowY: 'auto', height: '97%' }} ref={chatContainerRef}>
            <div className="row mx-0 bg-dark">
              <div
                className={`col-xl-3 col-md-4 chat-list-wrapper px-0 ${menuStatus} `}
              >
              </div>
              <div className="col-xl-12 col-md-12 px-0 d-flex flex-column">
                <div className="chat-container-wrapper bg-dark" >
                  {messages.map((message, index) => (
                    <div key={index} className={`chat-bubble ${message.type}-chat`}>
                      <div className="chat-message">
                        <p> {message.text.split('\n').map((line, index) => (
                          <span key={index}>
                            {index === 0 && message.type === 'outgoing' ? <strong>{line}</strong> : line}
                            <br />
                          </span>
                        ))}</p>
                      </div>
                      <div className="sender-details">
                        <img
                          className="sender-avatar img-xs rounded-circle"
                          src={message.type === 'outgoing' ? require("../../assets/images/faces/aibot.jpg") :
                            (context.user.sex === "male" ? require("../../assets/images/faces/male.jpg") : require("../../assets/images/faces/female.jpg"))}
                          alt="profile" />
                        <p className="seen-text">{message.type === 'outgoing' ? 'IMIT-Bot, ' : context.user.username + ', '}{message.time}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading ?
                    <div className="chat-bubble outgoing-chat">
                      <div className="chat-message">
                        <strong><p>正在生成诊断意见...</p></strong>
                        <img src={require("../../assets/images/squares.gif")} width="50" alt="Loading" />
                        <img src={require("../../assets/images/gears.gif")} width="50" alt="Loading" />
                        <img src={require("../../assets/images/gear2.gif")} width="50" alt="Loading" />
                        <img src={require("../../assets/images/donut.gif")} width="50" alt="Loading" />
                      </div>
                      <div className="sender-details">
                        <img
                          className="sender-avatar img-xs rounded-circle"
                          src={require("../../assets/images/faces/aibot.jpg")}
                          alt="profile" />
                        <p className="seen-text">{new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                    : null}
                </div>

              </div>
            </div>

          </div>
          <div className="chat-text-field mt-auto" style={{ height: '150px' }}>
            <form action="#">
              <div className="input-group" style={{ height: '151px' }} >
                <div className="input-group-prepend">
                  <button type="button" className="input-group-text bg-info text-white" style={{ height: '130px' }}>
                    <i className="mdi mdi-emoticon-happy-outline icon-sm "></i>
                  </button>
                </div>
                <textarea
                  className="form-control bg-white"
                  placeholder="请在此处输入内容：支持Ctrl+c终止当前对话， Enter键发送消息。"
                  style={{ resize: 'none', fontSize: '20px' }} // optional: to prevent user from resizing the textarea
                  value={textareaValue}
                  onKeyDown={handleKeyDown}
                  onChange={e => setTextareaValue(e.target.value)}
                />
                <div className="input-group-append">
                  <button type="button" className="input-group-text" style={{ height: '130px' }}>
                    <i className="mdi mdi-paperclip icon-sm"></i>
                  </button>
                </div>
                <div className="input-group-append ">
                  <button type="submit" className="input-group-text bg-primary" style={{ height: '130px' }} onClick={handleSubmit}>
                    <i className="mdi mdi-send icon-sm"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Chats;
