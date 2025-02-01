export type RoomSaveDto = {
  roomName: string
}

export type RoomFindByIdDto = {
  id: number,
  roomName: string
}

export type RoomFindAllDto = {
  id: number,
  roomName: string
}

export type RoomChatFindAllDto = {
  content: Array<RoomChat>;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type RoomChat = {
  member: {
    memberId: number;
    nickname: string;
  };
  message: string;
  createAt: string;
}
