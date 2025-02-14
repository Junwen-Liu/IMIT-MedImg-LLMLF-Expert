import React, { Component, useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../context/AuthContext";
const config = require('../../../package.json').customConfig;




const Chats = () => {
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');
  const chatContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AuthContext);
  const [startTime, setStartTime] = useState(null); // Variable to store the start time
  let totalTime; // Variable to store the total time
  const timerIdRef = useRef(null); // Create a mutable reference to the timerId
  const [question, setQuestion] = useState('');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');

  // Function to start the timer
  function startTimer() {
    setStartTime(Date.now()); // Set the start time (current timestamp
    timerIdRef.current = setInterval(displayTime, 1000);
    // timerId = setInterval(displayTime, 1000); // Start the timer and call displayTime every 1 second
  }

  // Function to stop the timer
  const stopTimer = async () => {
    // clearTimeout(timerId); // Clear the timer
    clearInterval(timerIdRef.current); // Clear the timer
    totalTime = formatElapseTime(Date.now());

    const data = {
      totalTime: totalTime,
      username: context.user.username,
      question: question,
      generatedAnswer: generatedAnswer,
      finalAnswer: finalAnswer,
    };

    console.log(`data is: ${data}`); // Display the total time

    try {
      const response = await fetch('http://localhost:4002/db_prosp/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('There was an error!', error.message);
    }
  }

  // Function to calculate and display the elapsed time
  function displayTime() {
    const currentTime = Date.now(); // Get the current timestamp
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate the elapsed time in seconds

    const minutes = Math.floor(elapsedTime / 60); // Calculate the minutes
    const seconds = elapsedTime % 60; // Calculate the remaining seconds

    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format the time as minutes:seconds

    console.log(formattedTime); // Display the formatted time

  }

  function formatElapseTime(currentTime) {
    // Calculate the elapsed time in seconds
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);

    // Calculate the minutes and remaining seconds
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    // Format the time as minutes:seconds
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Return the formatted time
    return formattedTime;
  }

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
      const SecondLastMessage = messages[messages.length - 2];
      console.log('lastmessage is', LastMessage.text);

      if (LastMessage.text !== '您好！请复制粘贴新的影像描述：' && LastMessage.type === 'incoming' && !LastMessage.text.startsWith('根据以上影像描述，IMIT-GPT生成的诊断意见如下：') && !SecondLastMessage.text.startsWith('请将最终修订的诊断意见粘贴发送在下方：') && !LastMessage.text.startsWith('请将最终修订的诊断意见粘贴并发送在下方：') && !LastMessage.text.startsWith('谢谢！最终版诊断意见已计入系统！')) {
        setIsLoading(true); // Start loading
        startTimer(); // Start the timer
        const concatText = '根据下面一段上腹部CT的影像描述：' + LastMessage.text + '生成一份对应的诊断意见：';
        const response = await fetch('http://localhost:4002/run-chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: config.modelPath,
            text: concatText
          }),
        });

        setQuestion(concatText);
        const data = await response.json();
        console.log(data);
        setMessages([...messages, { text: '根据以上影像描述，IMIT-GPT生成的诊断意见如下：\n \n ' + data.response.replace(/\n/g, ''), type: 'outgoing', time: new Date().toLocaleTimeString() }]);
        setIsLoading(false); // End loading
        // setGeneratedAnswer(data.response);
        setGeneratedAnswer(data.response.replace(/\n/g, ''));

      } else if (LastMessage.text.startsWith('根据以上影像描述，IMIT-GPT生成的诊断意见如下：')) {
        setTimeout(() => {
          setMessages([...messages, { text: '请将最终修订的诊断意见粘贴发送在下方：', type: 'outgoing', time: new Date().toLocaleTimeString() }]);
        }, 1500);
      } else if (SecondLastMessage.text.startsWith('请将最终修订的诊断意见粘贴发送在下方：')) {
        setFinalAnswer(LastMessage.text);
        setTimeout(() => {
          setMessages([...messages, { text: '谢谢！最终版诊断意见已计入系统！', type: 'outgoing', time: new Date().toLocaleTimeString() }]);
        }, 1500);
      } else if (LastMessage.text.startsWith('谢谢！最终版诊断意见已计入系统！')) {
        stopTimer(); // Stop the timer
        setTimeout(() => {
          setMessages([...messages, { text: '您好！请复制粘贴新的影像描述：', type: 'outgoing', time: new Date().toLocaleTimeString() }]);
        }, 1500);
      } else {
        console.log('您好！请复制粘贴新的影像描述： appear more than once')
      }
    };

    fetchData();
  }, [messages]);

  const initializeMessages = () => {
    // Replace this with your actual initial data
    const initialData = [
      { text: '（示例）您好！请复制粘贴新的影像描述：', type: 'outgoing', time: '10 min ago' },
      { text: '（示例）肝脏形态大小正常；肝内多发低密度灶；无强化；最大约28mm。胆囊形态大小正常；未见异常密度影。脾脏形态大小正常；未见异常密度影。胰腺形态大小正常；未见异常密度影。左肾下极类圆形高密度影；右肾未见异常。腹膜后未见异常增大的淋巴结影。附见右下肺斑结影', type: 'incoming', time: '9 min ago' },
      { text: '（示例）根据以上影像描述，IMIT-GPT生成的诊断意见如下：\n 脂肪肝；胆囊胆汁淤积；双肾囊性灶；左肾复杂囊肿可能。请结合临床；随诊。', type: 'outgoing', time: '10 min ago' },
      { text: '（示例）请将最终修订的诊断意见粘贴发送在下方：', type: 'outgoing', time: '9 min ago' },
      { text: '（示例）脂肪肝；胆囊胆汁淤积；双肾囊性灶；左肾复杂囊肿可能。请结合临床；随诊。', type: 'incoming', time: '9 min ago' },
      { text: '（示例）谢谢！最终版诊断意见已计入系统！', type: 'outgoing', time: '10 min ago' },
      { text: '（示例）您好！请复制粘贴新的影像描述：', type: 'outgoing', time: '10 min ago' },

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
      stopTimer(); // Stop the timer
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
                            {(index === 0 || index === 3) && message.type === 'outgoing' ? <strong>{line}</strong> : line}
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
