import {h, render} from 'preact';
import Widget from './widget';
import {defaultConfiguration} from './configuration';
import {IConfiguration} from "../typings";

if (window.attachEvent) {
    window.attachEvent('onload', injectChat);
} else {
    window.addEventListener('load', injectChat, false);
}

function getUrlParameter(name: string, defaults = '') {
    name = name.replace(/[[]/, '\\[').replace(/[]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(document.getElementById('botmanWidget').getAttribute('src'));
    return results === null ? defaults : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getUserId(conf: IConfiguration) {
    return conf.userId || generateRandomId();
}

function generateRandomId() {
    let name = "cid=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    let userId="";
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    const d = new Date();
    d.setTime(d.getTime() + (18250*24*60*60*1000));
    userId=Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
    document.cookie = "cid=" + userId + ";expires=" + + d.toUTCString() + ";path=/";
    return userId;
}

function injectChat() {
    let root = document.createElement('div');
    root.id = 'botmanWidgetRoot';
    document.getElementsByTagName('body')[0].appendChild(root);

    let settings = {};
    try {
        settings = JSON.parse(getUrlParameter('settings', '{}'));
    } catch (e) { }

    const dynamicConf = window.botmanWidget || {} as IConfiguration; // these configuration are loaded when the chat frame is opened

    dynamicConf.userId = getUserId({...defaultConfiguration, ...dynamicConf});

    if (typeof dynamicConf.echoChannel === 'function') {
        dynamicConf.echoChannel = dynamicConf.echoChannel('chat_'+dynamicConf.userId);
    }

    const conf = {...defaultConfiguration, ...settings, ...dynamicConf};

    const iFrameSrc = conf.frameEndpoint;

    render(
        <Widget
            isMobile={(window.screen.width < 500)||(window.screen.height < 500) }
            iFrameSrc={iFrameSrc}
            conf={conf}
        />,
        root
    );

}

declare global {
    interface Window { attachEvent: Function, botmanWidget: IConfiguration }
}
