export interface RollEvent {
    senderId: number;
    senderNickname: string;
    skinName: string;
    drawTime: Date;
    msgId: number;
    groupCode: number;
    groupName: string;
    participants: GroupMember[];
}

export interface GroupMember {
    Nickname: string
    CardName: string
    Uin: number
}