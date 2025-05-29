package com.prediction.backend.services.impl;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.prediction.backend.dto.ConversationDTO;
import com.prediction.backend.dto.DiseasePrediction;
import com.prediction.backend.dto.request.SearchingRequest;
import com.prediction.backend.dto.request.UpdateConversationRequest;
import com.prediction.backend.dto.response.BotResponse;
import com.prediction.backend.dto.response.BotResponseDetail;
import com.prediction.backend.dto.response.PredictionResponse;
import com.prediction.backend.dto.response.SearchingResponse;
import com.prediction.backend.exceptions.AppException;
import com.prediction.backend.exceptions.ErrorCode;
import com.prediction.backend.models.Conversation;
import com.prediction.backend.models.Disease;
import com.prediction.backend.models.Role;
import com.prediction.backend.models.User;
import com.prediction.backend.repositories.UserRepository;

import org.springframework.stereotype.Service;

import com.prediction.backend.models.ChatMessage;
import com.prediction.backend.services.ChatBotService;
import com.prediction.backend.services.ChatService;
import com.prediction.backend.services.PredictionService;
import com.prediction.backend.services.SearchingService;
import com.prediction.backend.repositories.ChatMessageRepository;
import com.prediction.backend.repositories.ConversationRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final Map<String, List<String>> userCollectedData = new HashMap<>();
    private final Map<String, ConversationDTO> userConversations = new HashMap<>();

    private final ChatBotService chatBotService;
    private final PredictionService predictionService;
    private final SearchingService searchingService;

    @Override
    public Conversation startConversation(String senderId, String receiverId, String firstMessage) {
        List<String> participants = List.of(senderId, receiverId);

        // Check if user exists
        userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String title;
        boolean isDoctor = receiver.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("DOCTOR"));
        boolean isBot = receiver.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("BOT"));

        if (isDoctor) {
            title = "Chat with doctor";
        } else if (isBot && firstMessage != null && !firstMessage.isBlank()) {
            // Get the main content: first sentence or first 10 words
            String[] sentences = firstMessage.split("[.!?]");
            String main = sentences[0].trim();
            String[] words = main.split("\\s+");
            title = String.join(" ", java.util.Arrays.copyOfRange(words, 0, Math.min(10, words.length)));
            if (words.length > 10)
                title += "...";
        } else {
            title = "New Chat";
        }
        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.setConversationId(UUID.randomUUID().toString());
        conversation.setTitle(title);
        conversation.setStartTime(Instant.now());
        conversation.setParticipantIds(participants);

        return conversationRepository.save(conversation);
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(message.getConversationId());
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            conversation.setLastMessageTime(Instant.now());
            conversationRepository.save(conversation);
        }

        message.setTimestamp(Instant.now());
        message.setRead(false);
        return messageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getChatHistory(String conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    @Override
    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipantIdsContaining(userId);
    }

    @Override
    public Conversation getConversationById(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
    }

    @Override
    public void addUserToConversation(String conversationId, String userId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        if (!conv.getParticipantIds().contains(userId)) {
            conv.getParticipantIds().add(userId);
            conversationRepository.save(conv);
        }
    }

    @Override
    public boolean checkDoctorInConversation(String conversationId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        if (conv.getParticipantIds().size() <= 2) {
            return false; // Chỉ có user và bot
        }

        // Lấy danh sách user có role là doctor từ participantIds
        for (String participantId : conv.getParticipantIds()) {
            Optional<User> participant = userRepository.findById(participantId);
            if (participant.isPresent() && participant.get().getRoles() != null) {
                // Kiểm tra xem trong Set<Role> có role nào có name là "DOCTOR" không
                for (Role role : participant.get().getRoles()) {
                    if (role.getName().equalsIgnoreCase("DOCTOR")) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    @Override
    public void removeUserFromConversation(String conversationId, String userId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        if (conv.getParticipantIds().contains(userId)) {
            conv.getParticipantIds().remove(userId);
            conversationRepository.save(conv);
        } else {
            throw new AppException(ErrorCode.USER_NOT_IN_CONVERSATION);
        }
    }

    // @Override
    // public BotResponseDetail handleData(String userMessage, String
    // conversationId) {
    // ConversationDTO conversationDTO =
    // userConversations.computeIfAbsent(conversationId,
    // id -> new ConversationDTO());
    // // boolean isNeededDoctor = false;
    // AtomicBoolean isNeededDoctor = new AtomicBoolean(false);
    // // Mono<String> responseChat;
    // Mono<String> response = chatBotService.ask(userMessage, conversationDTO,
    // conversationId)
    // .flatMap(reply -> {
    // userCollectedData.computeIfAbsent(conversationId, id -> new ArrayList<>())
    // .add("User: " + userMessage);
    // userCollectedData.get(conversationId).add("Bot: " + reply);

    // if (ConversationDTO.isJsonValid(reply)) {
    // Optional<String> extractedJson = ConversationDTO.extractJsonFromText(reply);
    // if (extractedJson.isPresent()) {
    // reply = extractedJson.get(); // Lấy ra JSON thuần { ... } để xử lý tiếp
    // }
    // try {
    // // Try Searching Service First
    // SearchingRequest searchReq = new SearchingRequest();
    // searchReq.setSymptomNames(ConversationDTO.extractSymptoms(reply));
    // SearchingResponse searchRep = searchingService.search(searchReq);
    // if (searchRep != null && searchRep.getDiseases() != null &&
    // !searchRep.getDiseases().isEmpty()) {
    // List<Disease> diseases = searchRep.getDiseases();
    // String result = diseases.stream()
    // .map(d -> String.format(
    // "- Tên (VN): %s\n Tên (EN): %s\n Mô tả (VN): %s\n Mô tả (EN): %s",
    // d.getNameVn() != null ? d.getNameVn() : "(không có)",
    // d.getNameEn(),
    // d.getDescriptionVn() != null ? d.getDescriptionVn() : "(không có)",
    // d.getDescriptionEn() != null ? d.getDescriptionEn() : "(không có)"
    // ))
    // .collect(Collectors.joining("\n\n"));
    // reset(conversationId);
    // return Mono.just("🔍 Đã tìm thấy bệnh từ hệ thống:\n\n" + result);
    // }
    // // If no results from searching, fallback to AI model
    // isNeededDoctor.set(true);
    // // for (int i=0; i < 8; i++){
    // System.out.println("Go though");
    // JsonObject obj = JsonParser.parseString(reply).getAsJsonObject();
    // JsonObject metadata = obj.getAsJsonObject("metadata");

    // int age = metadata.get("age").getAsInt();
    // String gender = metadata.get("gender").getAsString();
    // String region = metadata.get("region").getAsString();
    // LocalDateTime time = LocalDateTime.now();

    // List<String> symptoms = new ArrayList<>();
    // for (JsonElement el : obj.getAsJsonArray("symptoms")) {
    // symptoms.add(el.getAsString());
    // }

    // List<String> riskFactors = new ArrayList<>();
    // if (obj.has("risk_factors")) {
    // for (JsonElement el : obj.getAsJsonArray("risk_factors")) {
    // riskFactors.add(el.getAsString());
    // }
    // }
    // // Mono<PredictionResponse> predictionResponse =
    // predictionService.predictDisease(gender, age, region, time.toString(),
    // symptoms, riskFactors, 5);
    // // Mono<Boolean> check =
    // PredictionResponse.checkConfident(predictionResponse);
    // // if (check){
    // // List<DiseasePrediction> diseases =
    // predictionResponse.getTop_predictions();
    // // String result = diseases.stream()
    // // .map(DiseasePrediction::toString)
    // // .reduce((a, b) -> a + ", " + b)
    // // .orElse("No suitable solution");
    // // return Mono.just("Predict: " + result);
    // // }
    // // else {
    // // String prompt="Hien tai thieu thong tin ve symptoms va risk hay tiep tuc
    // hoi them ve benh nhan va tra ve json thu thap thong tin nhu yeu cau";
    // // userCollectedData.get(conversationId).add("External Disease Model: " +
    // prompt);
    // // return Mono.just(reply);
    // // }
    // Mono<PredictionResponse> predictionResponse =
    // predictionService.predictDisease(
    // gender, age, region, time.toString(), symptoms, riskFactors, 5
    // );

    // return predictionResponse.flatMap(prs -> {
    // boolean isConfident = PredictionResponse.checkConfident(prs);

    // if (isConfident) {
    // List<DiseasePrediction> diseases = prs.getTop_predictions();
    // String result = diseases.stream()
    // .map(DiseasePrediction::toString)
    // .reduce((a, b) -> a + ", " + b)
    // .orElse("No suitable solution");

    // return Mono.just("Predict: " + result); // ✅ MUST return
    // } else {
    // String prompt = "Hiện tại thiếu thông tin về symptoms và risk, hãy tiếp tục
    // hỏi thêm về bệnh nhân";
    // userCollectedData.get(conversationId).add("External Disesase Model: " +
    // prompt);
    // return Mono.just("System is process, please provide more information");
    // // return Mono.just(reply);
    // }
    // });

    // // }

    // // return Mono.just(reply);

    // } catch (Exception e) {
    // // Handle exception here
    // e.printStackTrace();
    // return Mono.just("Đã xảy ra lỗi trong quá trình xử lý dữ liệu.");
    // }
    // }

    // return Mono.just(reply);
    // });
    // return BotResponseDetail.builder()
    // .data(response)
    // .isNeededDoctor(isNeededDoctor.get())
    // .build();
    // }
    @Override
    public BotResponseDetail handleData(String userMessage, String conversationId, int ageProvided,
            String genderProvided,
            String underlyingDisease) {
        ConversationDTO conversationDTO = userConversations.computeIfAbsent(conversationId,
                id -> new ConversationDTO());
        AtomicBoolean isNeededDoctor = new AtomicBoolean(false);
        List<String> collectedData = userCollectedData.computeIfAbsent(conversationId, id -> new ArrayList<>());
        userMessage += "\nUser detail: age: " + ageProvided + " gender: " + genderProvided + " underlying_disease"
                + underlyingDisease;
        try {
            // Gọi model chat để trả lời
            String reply = chatBotService.ask(userMessage, conversationDTO, conversationId).block(); // cần viết hàm
                                                                                                     // đồng bộ
            String jsonReply = null;
            String mainReply = null;
            collectedData.add("User: " + userMessage + '\n');
            collectedData.add("Bot: " + reply + '\n');

            if (ConversationDTO.isJsonValid(reply)) {
                Optional<String> extractedJson = ConversationDTO.extractJsonFromText(reply);
                if (extractedJson.isPresent()) {
                    jsonReply = extractedJson.get();
                }
                System.out.println("------------" + jsonReply);
                SearchingRequest searchReq = new SearchingRequest();
                searchReq.setSymptomNames(ConversationDTO.extractSymptoms(jsonReply));

                SearchingResponse searchRep = searchingService.search(searchReq);

                if (searchRep != null && searchRep.getDiseases() != null && !searchRep.getDiseases().isEmpty()) {
                    List<Disease> diseases = searchRep.getDiseases();
                    String result = diseases.stream()
                            .map(d -> String.format(
                                    "- Tên (VN): %s\n  Tên (EN): %s\n  Mô tả (VN): %s\n  Mô tả (EN): %s",
                                    d.getNameVn() != null ? d.getNameVn() : "(không có)",
                                    d.getNameEn(),
                                    d.getDescriptionVn() != null ? d.getDescriptionVn() : "(không có)",
                                    d.getDescriptionEn() != null ? d.getDescriptionEn() : "(không có)"))
                            .collect(Collectors.joining("\n\n"));

                    reset(conversationId);
                    return BotResponseDetail.builder()
                            .data("🔍 Đã tìm thấy bệnh từ hệ thống:\n\n" + result)
                            .isNeededDoctor(false)
                            .build();
                }

                // Nếu không tìm được trong hệ thống, chuyển sang AI model
                JsonObject obj = JsonParser.parseString(jsonReply).getAsJsonObject();
                // JsonObject metadata = obj.getAsJsonObject("metadata");

                int age = obj.get("age").getAsInt();
                String gender = obj.get("gender").getAsString();
                String region = obj.get("region").getAsString();
                // LocalDateTime time = LocalDateTime.now();
                LocalDateTime time = LocalDateTime.parse(obj.get("symptomStartTime").getAsString());

                List<String> symptoms = new ArrayList<>();
                for (JsonElement el : obj.getAsJsonArray("symptoms")) {
                    symptoms.add(el.getAsString());
                }

                List<String> riskFactors = new ArrayList<>();
                if (obj.has("risk_factors")) {
                    for (JsonElement el : obj.getAsJsonArray("risk_factors")) {
                        riskFactors.add(el.getAsString());
                    }
                }

                // Gọi mô hình dự đoán đồng bộ
                PredictionResponse prs = predictionService.predictDisease(
                        gender, age, region, time.toString(), symptoms, riskFactors, 5).block();

                boolean isConfident = PredictionResponse.checkConfident(prs);
                mainReply = ConversationDTO.removeJsonBlock(reply);
                System.out.println(mainReply);
                System.out.println(mainReply == "1");
                if (mainReply.equals("1")) {
                    isNeededDoctor.set(true);
                    reset(conversationId);
                    return BotResponseDetail.builder()
                            .data("We will call doctor for you")
                            .isNeededDoctor(isNeededDoctor.get())
                            .log(jsonReply)
                            .build();
                }
                if (isConfident) {
                    List<DiseasePrediction> diseases = prs.getTop_predictions();
                    String result = diseases.stream()
                            .map(DiseasePrediction::toString)
                            .reduce((a, b) -> a + ", " + b)
                            .orElse("No suitable solution");
                    reset(conversationId);
                    return BotResponseDetail.builder()
                            .data("Predict: " + result)
                            .isNeededDoctor(isNeededDoctor.get())
                            .log(jsonReply)
                            .build();
                } else {
                    // String prompt = "result of Disease model not true because Loss information of
                    // Symptoms and Risk Factors," +
                    // "so You should ask more question to collection information from user and
                    // recommend call to doctor. If user responds or replies no more symptoms or
                    // call doctor then return string 1 and the collected json.";
                    // collectedData.add("External Disease Model: " + prompt);
                    String recommend = "Please provide more information about your current condition so I can make an accurate diagnosis. Or you want to call Doctor";
                    System.out.println(collectedData);
                    return BotResponseDetail.builder()
                            .data(ConversationDTO.removeJsonBlock(reply) + '\n' + recommend)
                            .isNeededDoctor(isNeededDoctor.get())
                            .build();
                }
            }

            // Trường hợp không phải JSON hợp lệ
            return BotResponseDetail.builder()
                    .data(reply)
                    .isNeededDoctor(isNeededDoctor.get())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return BotResponseDetail.builder()
                    .data("Đã xảy ra lỗi trong quá trình xử lý dữ liệu.")
                    .isNeededDoctor(false)
                    .build();
        }
    }

    @Override
    public void reset(String conversationId) {
        userCollectedData.remove(conversationId);
        userConversations.remove(conversationId);
    }

    @Override
    public void deleteConversation(String conversationId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        // Xoá tất cả message thuộc conversation này (nếu cần)
        messageRepository.deleteAll(messageRepository.findByConversationIdOrderByTimestampAsc(conversationId));
        conversationRepository.delete(conv);
    }

    @Override
    public Conversation updateConversation(String conversationId, UpdateConversationRequest request) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        if (request.getTitle() != null) {
            conv.setTitle(request.getTitle());
        }
        // Thêm cập nhật các trường khác nếu cần
        return conversationRepository.save(conv);
    }
}