export interface RollEvent {
    senderId: number;
    senderNickname: string;
    skinName: string;
    drawTime: Date;
    msgId: number;
    groupCode: number;
    groupName: string;
    participants: any[];
}