import { h, Component } from 'preact';
import {mobileClosedMessageAvatarStyle, closedChatAvatarImageStyle} from './style';
import { IConfiguration } from '../typings';

export default class ChatFloatingButton extends Component<IChatFloatingButtonProps, any> {

    render({onClick, conf}: IChatFloatingButtonProps, {}) {
        let position;
        if (conf.position == 'tr') {
            position = {right: conf.marginHorizontal, top: conf.marginVertical};
        } else if (conf.position == 'tl') {
            position = {left: conf.marginHorizontal, top: conf.marginVertical};
        } else if (conf.position == 'br') {
            position = {right: conf.marginHorizontal, bottom: conf.marginVertical};
        } else {
            position = {left: conf.marginHorizontal, bottom: conf.marginVertical};
        }

        return (
            <div style={{position: 'fixed', cursor: 'pointer', ...position}} onClick={this.props.onClick}>
                <div
                    className="mobile-closed-message-avatar"
                    style={{
                        background: conf.bubbleBackground,
                        ...mobileClosedMessageAvatarStyle
                    }}
                >

                    {(conf.bubbleAvatarUrl === '') ?
                        <svg style={{
                            width: '60%',
                            height: 'auto'
                        }}
                        fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"
                        xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                        :
                        ((conf.bubbleAvatarUrl.indexOf('/')!==-1) ?
                            <img
                                src={conf.bubbleAvatarUrl}
                                style={{...closedChatAvatarImageStyle}}
                            />: <div style={{ display: 'flex', alignItems: 'center' }}><br/>{conf.bubbleAvatarUrl}</div>)
                    }
                </div>
            </div>
        );
    }
}

interface IChatFloatingButtonProps {
    onClick: any,
    conf: IConfiguration
}
