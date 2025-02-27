import { h, Component } from "preact";
import MessageArea from "./message-area";
import { botman } from "./botman";
import {IMessage, IConfiguration} from "../typings";
import axios from 'axios';

export default class Chat extends Component<IChatProps, IChatState> {

    [key: string]: any
    botman: any;
    input: HTMLInputElement;
    fileinput: HTMLInputElement;
 //   textarea: HTMLInputElement;

    constructor(props: IChatProps) {
        super(props);

        this.botman = botman;
        this.botman.setUserId(this.props.userId);
        this.botman.setChatServer(this.props.conf.chatServer);
        //this.state.messages = [];
        //this.state.replyType = ReplyType.Text;
        let messages: Array<IMessage> = [];
        let history = localStorage.getItem('chat_history_'+this.props.userId);
        if(history)
            try {
                messages = JSON.parse(history) ;
            } catch (e) {
            }
        this.setState({ messages : messages });
        this.setState({ replyType : ReplyType.Text });
    }

    componentDidMount() {
        if (!this.state.messages.length && (this.props.conf.introMessage || this.props.conf.introActions)) {
               if(this.props.conf.introMessage) this.writeToMessages({
                    text: this.props.conf.introMessage,
                    // type: this.props.conf.introActions?"actions":"text",
                    type:"text",
                    from: "chatbot",
                });
               if(this.props.conf.introActions) this.writeToMessages({
                   text: "",
                   type: "actions",
                   from: "actions",
                   actions: this.props.conf.introActions
               });
        } else {
            this.setState({
                scrollBottom: true
            });
        }
        // Add event listener for widget API
        window.addEventListener("message", (event: MessageEvent) => {
            try {
                this[event.data.method](...event.data.params);
            } catch (e) {
                //
            }
        });
    }

    sayAsBot(text: string) {
        this.writeToMessages({
            text,
            type: "text",
            from: "chatbot"
        });
    }

    say(text: string, showMessage = true) {
        const message: IMessage = {
            text,
            type: "text",
            from: "visitor"
        };

        // Send a message from the html user to the server
        this.botman.callAPI(message.text, false, null, (msg: IMessage) => {
            msg.from = "chatbot";
            this.writeToMessages(msg);
        });

        if (showMessage && !this.props.conf.useEcho) {
            this.writeToMessages(message);
        }
    }

    whisper(text: string) {
        this.say(text, false);
    }
    wheel = (event:any) => {
        // if(event.deltaY<0)  this.gethistory();
        if(event.deltaY<0)   this.gethistory();
    }
    scrollcapture = (event:any) => {
        if(event.target.scrollTop===0)  this.gethistory();
    }

    timer:any = null;
    gethistory(){
        if (this.timer) return;
        this.timer = setTimeout(() => {
            let data = new FormData();
            data.append('driver', 'web');
            data.append('eventName', 'userHistory');
            data.append('userId', this.props.userId);
            data.append('eventData', '');
            axios.post(this.props.conf.chatServer, data).then(response => {
                const messages = response.data.messages || [];
                messages.forEach((message : IMessage) => {
                    this.writeToMessages(message, true);
                });
            });
            // clearTimeout(this.timer);
            this.timer=null;
        }, 500);
    }
    render({}, state: IChatState) {
        return (
            <div class="chatContent" >
                <div id="messageArea" onWheel={this.wheel} onScrollCapture={this.scrollcapture}>
                    <MessageArea
                        messages={state.messages}
                        scrollBottom={state.scrollBottom}
                        conf={this.props.conf}
                        messageHandler={this.writeToMessages}
                    />
                </div>

                {this.state.replyType === ReplyType.Text ? (
                    <div class="userControl">
                        <input style="display:none" type="file" id="fileInput" multiple
                               onChange={this.handleSendAttachments}
                               ref={input => {
                                   this.fileinput= input as HTMLInputElement;
                               }}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg"
                             onClick={this.handleAttachmentClick}
                             class="userButton"
                             viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12,24c-4.96,0-9-4.04-9-9V6.5C3,2.92,5.92,0,9.5,0s6.5,2.92,6.5,6.5V15c0,2.21-1.79,4-4,4s-4-1.79-4-4V6.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5V15c0,.55,.45,1,1,1s1-.45,1-1V6.5c0-1.93-1.57-3.5-3.5-3.5s-3.5,1.57-3.5,3.5V15c0,3.31,2.69,6,6,6s6-2.69,6-6V4.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5V15c0,4.96-4.04,9-9,9Z"/>
                        </svg>
                        <input
                            id="userText"
                            class="textarea"
                            type="text"
                            placeholder={this.props.conf.placeholderText}
                            ref={input => {
                                this.input = input as HTMLInputElement;
                                if(input) input.focus();
                            }}
                            onKeyPress={this.handleKeyPress}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                             onClick={this.handleSendClick}
                             class="userButton"
                             width="24" height="24"
                             viewBox="0 0 535.5 535.5">
                            <g>
                                <g id="send">
                                    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                ) : ''}

                {this.state.replyType === ReplyType.TextArea ? (
                    <div class="userControl">
                        <input style="display:none" type="file" id="fileInput" multiple
                               onChange={this.handleSendAttachments}
                               ref={input => {
                                   this.fileinput= input as HTMLInputElement;
                               }}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg"
                             onClick={this.handleAttachmentClick}
                             class="userButton"
                             viewBox="0 0 24 24" width="24" height="24">
                            <path
                                d="M12,24c-4.96,0-9-4.04-9-9V6.5C3,2.92,5.92,0,9.5,0s6.5,2.92,6.5,6.5V15c0,2.21-1.79,4-4,4s-4-1.79-4-4V6.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5V15c0,.55,.45,1,1,1s1-.45,1-1V6.5c0-1.93-1.57-3.5-3.5-3.5s-3.5,1.57-3.5,3.5V15c0,3.31,2.69,6,6,6s6-2.69,6-6V4.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5V15c0,4.96-4.04,9-9,9Z"/>
                        </svg>
                        <input
                            id="userText"
                            class="textarea"
                            type="text"
                            placeholder={this.props.conf.placeholderText}
                            ref={input => {
                                this.input = input as HTMLInputElement;
                                if(input) input.focus();
                            }}
                            onKeyPress={this.handleKeyPress}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                             onClick={this.handleSendClick}
                             class="userButton"
                             width="24" height="24"
                             viewBox="0 0 535.5 535.5">
                            <g>
                                <g id="send">
                                    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                ) : ''}

                <a class="banner" href={this.props.conf.aboutLink} target="_blank">
                    {this.props.conf.aboutText === "AboutIcon" ? (
                        <svg
                            style="position: absolute; width: 14px; bottom: 6px; right: 6px;"
                            fill="#EEEEEE"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1536 1792"
                        >
                            <path d="M1024 1376v-160q0-14-9-23t-23-9h-96v-512q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v160q0 14 9 23t23 9h96v320h-96q-14 0-23 9t-9 23v160q0 14 9 23t23 9h448q14 0 23-9t9-23zm-128-896v-160q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v160q0 14 9 23t23 9h192q14 0 23-9t9-23zm640 416q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                        </svg>
                    ) : (
                        this.props.conf.aboutText
                    )}
                </a>
            </div>
        );
    }

    handleKeyPress = (e: KeyboardEvent) => {
        if (e.keyCode === 13 && this.input.value.replace(/\s/g, "")) {
            this.say(this.input.value);

            // Reset input value
            this.input.value = "";
        }
    };

    handleSendClick = (e: MouseEvent) => {
        // this.say(this.textarea.value);

        // Reset input value
        // this.textarea.value = "";
        if (this.input.value.replace(/\s/g, "")) {
            this.say(this.input.value);
            this.input.value = "";
        }
    };

    handleAttachmentClick = (e: MouseEvent) =>{
        this.fileinput.click();
    };
    handleSendAttachments = (e: Event) =>{
        let files = (e.target as HTMLInputElement).files;
        // @ts-ignore
        const arr = Array.from(files);
        const validImageTypes: Array<string> = ['image/gif', 'image/jpeg', 'image/png'];
        const validVideoTypes: Array<string> = ['video/mp4', 'video/mov', 'video/avi'];
        const validAudioTypes: Array<string> = ['audio/mp3', 'audio/ogg', 'audio/wav'];
        let botman=this.botman;
        let writeToMessages = this.writeToMessages;

        arr.forEach(function(file: File) {
            const data = new FormData();
            data.append("driver", "web");
            data.append("interactive", '0');
            data.append("file", file);
            data.append("filename",  file.name);
            data.append("userId", botman.userId);

            if (validImageTypes.indexOf(file.type)>-1) {
                data.append("attachment", 'image');
            }
            else if (validVideoTypes.indexOf(file.type)>-1) {
                data.append("attachment", 'video');
            }
            else if (validAudioTypes.indexOf(file.type)>-1) {
                data.append("attachment", 'audio');
            } else  data.append("attachment", 'file');

            axios.post(botman.chatServer, data).then(response => {
                const messages = response.data.messages || [];

                messages.forEach((message : IMessage) => {
                    writeToMessages(message);
                });

            });
        })

        this.fileinput.value=null;
    }

    static generateUuid() {
        let uuid = '', ii;
        for (ii = 0; ii < 32; ii += 1) {
            switch (ii) {
                case 8:
                case 20:
                    uuid += '-';
                    uuid += (Math.random() * 16 | 0).toString(16);
                    break;
                case 12:
                    uuid += '-';
                    uuid += '4';
                    break;
                case 16:
                    uuid += '-';
                    uuid += (Math.random() * 4 | 8).toString(16);
                    break;
                default:
                    uuid += (Math.random() * 16 | 0).toString(16);
            }
        }
        return uuid;
    }

    chatOpen = () =>{
        if(this.input) this.input.focus();
    }
    writeToManyMessages = (messages: Array<IMessage>) => {
        messages.forEach((msg : IMessage) => {
            if (typeof msg.time === "undefined") {
                msg.time = new Date().toJSON();
            }
            if (typeof msg.visible === "undefined") {
                msg.visible = false;
            }
            if (typeof msg.timeout === "undefined") {
                msg.timeout = 0;
            }
            if (typeof msg.id === "undefined") {
                msg.id = Chat.generateUuid();
            }

            if (msg.attachment === null) {
                msg.attachment = {}; // TODO: This renders IAttachment useless
            }

            this.state.messages.push(msg);
        });

        this.setState({
            messages: this.state.messages,
            scrollBottom: true
        });
        localStorage.setItem('chat_history_'+this.props.userId, JSON.stringify(this.state.messages));
        // if (msg.additionalParameters && msg.additionalParameters.replyType) {
        //     this.setState({
        //         replyType: msg.additionalParameters.replyType
        //     });
        // }
    }


	writeToMessages = (msg: IMessage, first = false, state=true) => {
        if (typeof msg.time === "undefined") {
            msg.time = new Date().toJSON();
        }
        if (typeof msg.visible === "undefined") {
            msg.visible = false;
        }
        if (typeof msg.timeout === "undefined") {
            msg.timeout = 0;
        }
        if (typeof msg.id === "undefined") {
            msg.id = Chat.generateUuid();
        }

	    if (msg.attachment === null) {
	        msg.attachment = {}; // TODO: This renders IAttachment useless
	    }

        if(first) this.state.messages.unshift(msg); else this.state.messages.push(msg);
	    this.setState({
	        messages: this.state.messages,
            scrollBottom: !first
	    });
        localStorage.setItem('chat_history_'+this.props.userId, JSON.stringify(this.state.messages));
	    if (msg.additionalParameters && msg.additionalParameters.replyType) {
	        this.setState({
                replyType: msg.additionalParameters.replyType
            });
        }
	};
}

interface IChatProps {
    userId: string,
    conf: IConfiguration
}

enum ReplyType {
    Text = "text",

    TextArea = "textarea"
}

interface IChatState {
    messages: IMessage[],
    scrollBottom: boolean,

    replyType: string
}
