import { h, Component } from "preact";
import MessageType from "./messagetype";
import { IMessageTypeProps } from "../../typings";

export default class TextType extends MessageType {
    render(props: IMessageTypeProps) {
        const message = props.message;
        const attachment = message.attachment;

        const textObject = { __html: message.text };

        return (
            <div>
                <p dangerouslySetInnerHTML={textObject} />

                {attachment && attachment.type === "image" ? (
                    <img src={attachment.url} style="max-width: 100%;" />
                ) : (
                    ""
                )}
                {attachment && attachment.type === "audio" ? (
                    <audio controls autoPlay={false} style="max-width: 100%;">
                        <source src={attachment.url} type="audio/mp3" />
                    </audio>
                ) : (
                    ""
                )}
                {attachment && attachment.type === "video" ? (
                    <video
                        height={props.conf.videoHeight}
                        controls
                        autoPlay={false}
                        style="max-width: 100%;"
                    >
                        <source src={attachment.url} type="video/mp4" />
                    </video>
                ) : (
                    ""
                )}
                {attachment && attachment.type === "contact" ? (
                    <div>
                        <h3>{attachment.last_name} {attachment.first_name}</h3>
                        <a href="tel://{attachment.phone_number}">{attachment.phone_number}</a>
                    </div>
                ) : (
                    ""
                )}
                {attachment && attachment.type === "location" ? (
                    <div>
                        <h3>Location</h3>
                        <a href="geo:///{attachment.latitude},-{attachment.longitude}">Location</a>

                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
