import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";

//importando themas ou pode colocar como default
import "codemirror/theme/dracula.css";

//importando mode de linguagens ou pode deixa como "" que sera trabalhada como text
import "codemirror/mode/javascript/javascript";

import { HomeText } from "./HomeStyles";

import send from "../assets/send.svg";
import edited from "../assets/edited.svg";
import loading from "../assets/loading.gif";
import liveOn from "../assets/liveOn.svg";
import liveOff from "../assets/liveOff.svg";

class Home extends Component {
  constructor(props) {
    super(props);
    var novoTexto;
    var editarText = false;
    var line = 0;
    var ch = 0;
    this.textArea = React.createRef();
  }
  state = {
    _id: null,
    text: "",
    autoUpdate: true
  };

  async componentDidMount() {
    this.registerToSocket();

    const {
      match: { params }
    } = this.props;

    const _id = params._id === undefined ? "home" : params._id;

    const response = await api.get(_id);

    this.setState({
      _id: response.data._id,
      text: response.data.text === null ? "" : response.data.text
    });

    this.novoTexto = this.state.text;
    this.refs.imgUp.src = send;
    this.refs.live.src = liveOn;
  }

  registerToSocket = () => {
    const {
      match: { params }
    } = this.props;

    const _id = params._id === undefined ? "home" : params._id;

    const socket = io("https://rafaelsene.herokuapp.com/");

    socket.on(_id, newPost => {
      if (!this.state.autoUpdate) {
        this.setState({ text: newPost.text });
        this.refs.imgUp.src = send;
      }
    });
  };

  sendText = async () => {
    this.refs.imgUp.src = loading;
    //await this.setState({ text: this.novoTexto });
    /*
    console.log(this.textArea.current.getCodeMirror().doc.sel.ranges[0].anchor);
    */
    const cursor = this.textArea.current.getCodeMirror().doc.sel.ranges[0]
      .anchor;

    this.line = cursor.line;
    this.ch = cursor.ch;

    await api.post(this.state._id, this.state);
    this.refs.imgUp.src = send;
    /*
    this.textArea.current.focus();
    this.textArea.current.getCodeMirror().doc.setSelection(
      {
        line: this.state.line,
        ch: this.state.ch
      },
      { line: this.state.line, ch: this.state.ch },
      { scroll: true }
    );*/
  };

  render() {
    var options = {
      readOnly: false,
      tabSize: 4,
      lineNumbers: true,
      mode: "javascript",
      theme: "dracula",
      value: this.state.text
    };
    return (
      <HomeText>
        <header>
          <img ref="imgUp" onClick={this.sendText} alt="" />
          <img ref="live" onClick={() => {}} alt="" />
        </header>
        <CodeMirror
          ref={this.textArea}
          onChange={editor => {
            this.state.text = editor;
            this.refs.imgUp.src = edited;
            this.sendText();
          }}
          options={options}
        />
        <footer />
      </HomeText>
    );
  }
}

export default Home;
