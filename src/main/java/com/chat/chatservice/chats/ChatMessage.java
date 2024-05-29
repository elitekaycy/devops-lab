package com.chat.chatservice.chats;

import lombok.Builder;

@Builder
public record ChatMessage(String content, String sender, ChatMessageTypeEnum type) {

}
