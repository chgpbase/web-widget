

export interface IMessageTypeProps {
    message: IMessage,
    calculatedTimeout?: number,
    messageHandler: Function,
    onVisibilityChange: Function,
    timeout: number,
    conf?: IConfiguration,
}

export interface IMessageHolderProps {
    message: IMessage,
    calculatedTimeout: number,
    messageHandler: Function,
    conf?: IConfiguration,
    scrollBottom: boolean
}

export interface IMessageTypeState {
    visible: boolean,
    visibilityChanged: boolean,
    attachmentsVisible: boolean
}

export interface IMessage {
    id?: string,
    text: string,
    type: "text" | "list" | "actions" | "buttons",
    timeout?: number,
    from: string,
    time?: string,
    visibilityChanged?: boolean;
    visible?: boolean,
    actions?: IAction[],
    buttons?: IButton[],
    attachment?: IAttachment,
    globalButtons?: IButton[],
    additionalParameters?: any,
    elements?: IElement[],
}

export interface IAttachment {
    url?: string,
    type?: string,
    last_name?: string,
    first_name?: string,
    phone_number?: string,
    latitude?: string,
    longitude?: string,
}

export interface IElement {
    title : string,
    image_url: string,
    item_url: string,
    subtitle: string,
    default_action: IAction,
    buttons: IButton[],
}


export interface IButton {
    type: string,
    title: string,
    url: string,
    payload: string,
}

export interface IAction {
    text: string,
    value: string,
}

export interface IConfiguration {
    /**
     * The URL of the BotMan route / server to use.
     */
    chatServer: string,
    /**
     * The location of your chat frame URL / route.
     */
    frameEndpoint: string,
    /**
     * Date and time format to use
     */
    timeFormat: string;
    dateTimeFormat: string,
    /**
     * The title to use in the widget header.
     */
    title: string,
    /**
     * How many days is the cookie valid?
     */
    cookieValidInDays: number,
    /*
     * This is a welcome message that every new user sees
     * when the widget is opened for the first time.
     */
    introMessage: string,
    introActions : IAction[],
    /*
     * Input placeholder text
     */
    placeholderText: string,
    /*
     * Toggle display of message times
     */
    displayMessageTime: boolean,
    /*
     * Send a widget opened event
     */
    sendWidgetOpenedEvent: boolean,
    widgetOpenedEventData: string,
    mainColor: string,
    headerTextColor: string,
    bubbleBackground: string,
    bubbleAvatarUrl: string,
    desktopHeight: number,
    desktopWidth: number,
    mobileHeight: string,
    mobileWidth: string,
    videoHeight: number,
    aboutLink: string,
    aboutText: string,
    chatId: string,
    userId: string,
    wrapperHeight?: number,
    alwaysUseFloatingButton: boolean,

    useEcho: boolean,

    echoChannel: string | any,

    echoChannelType: string,

    echoConfiguration: any,

    echoEventName: string,
    position: "br" | "bl" | "tr" | "tl",
    marginVertical: string,
    marginHorizontal: string,
    init?: Function
}
