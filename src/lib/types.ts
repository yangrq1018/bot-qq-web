export interface RollEvent {
    senderId: number
    senderNickname: string
    skinName: string
    drawTime: Date
    msgId: number
    groupCode: number
    groupName: string
    participants: GroupMember[]
}

export interface GroupMember {
    Nickname: string
    CardName: string
    Uin: number
}

export interface GroupInfo {
    Uin: number
    Code: number
    Name: string
    OwnerUin: number
    GroupCreateTime: number
    GroupLevel: number
    MemberCount: number
    MaxMemberCount: number
}

export interface Price {
    bondCode: string
    symbol: string
    valueOn: Date,
    theoryValue: number
    tradeValue: number
    discount: number
    delta: number
    gamma: number
}