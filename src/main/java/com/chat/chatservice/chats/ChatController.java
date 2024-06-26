package com.chat.chatservice.chats;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

  @MessageMapping("/chat.sendMessage")
  @SendTo("/topic/public")
  public ChatMessage sendChatMessage(@Payload ChatMessage message) {
    return message;
  }

  @MessageMapping("/chat.addUser")
  @SendTo("/topic/public")
  public ChatMessage addChatUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
    headerAccessor.getSessionAttributes().put("username", message.sender());
    return message;
  }

}
