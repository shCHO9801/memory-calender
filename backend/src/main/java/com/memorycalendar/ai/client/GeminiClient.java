package com.memorycalendar.ai.client;

import com.memorycalendar.ai.dto.AiScheduleExtractionResult;
import com.memorycalendar.libs.exception.CustomException;
import com.memorycalendar.libs.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;

import static com.memorycalendar.libs.exception.ErrorCode.AI_API_ERROR;

@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final ChatClient.Builder chatClientBuilder;

    public AiScheduleExtractionResult extractSchedule(String content) {

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));
        ChatClient chatClient = chatClientBuilder.build();


        try {
            return chatClient.prompt()
                    .system("""
                        너는 사용자의 메모에서 일정 후보를 추출하는 AI다.
                        
                        현재 기준 날짜: %s
                        기준 시간대: Asia/Seoul
                        
                        규칙:
                        - 메모에 명시적으로 존재하는 정보만 사용한다.
                        - 메모에 없는 정보를 추측하거나 일반적인 관행을 근거로 생성하지 않는다.
                        - 실제 일정으로 볼 수 있는 정보만 추출한다.
                        - 일정이 없으면 candidates는 빈 배열로 반환한다.
                        
                        날짜/시간:
                        - 연도가 생략된 날짜는 현재 기준 날짜에서 가장 자연스러운 미래 날짜로 해석한다.
                        - 상대 날짜는 현재 기준 날짜를 기준으로 계산한다.
                        - 시작 시간이 명시되어 있으면 startAt에 사용한다.
                        - 종료 시간이 명시되어 있지 않으면 반드시 endAt은 null이다.
                        - 일정의 일반적인 소요 시간을 추측하여 endAt을 생성하지 않는다.
                        - "아침", "점심", "오후", "저녁", "밤"처럼 정확한 시각이 없는 표현은
                          임의의 시각으로 변환하지 않는다.
                        - 정확한 시각을 결정할 수 없는 경우 시간을 임의로 생성하지 않고
                          needsConfirmation을 true로 설정한다.
                        
                        텍스트:
                        - title은 일정의 핵심 내용을 간결하게 작성한다.
                        - 별도의 설명이 메모에 없으면 description은 반드시 null이다.
                        - location은 구체적인 장소 정보가 메모에 명시된 경우에만 작성한다.
                        - "치과", "회사", "병원"처럼 일정 종류나 일반적인 장소 표현만으로
                          구체적인 위치라고 판단하지 않는다.
                        
                        확인 여부:
                        - 날짜, 시간, 장소 등 일정 저장에 중요한 정보가 실제로 불확실할 때만
                          needsConfirmation을 true로 설정한다.
                        - 단순히 endAt, description, location이 null이라는 이유만으로
                          needsConfirmation을 true로 설정하지 않는다.
                        
                        형식:
                        - startAt, endAt은 ISO-8601 LocalDateTime 형식을 사용한다.
                        """.formatted(today))
                    .user("""
                        메모:
                        %s
                        """.formatted(content))
                    .call()
                    .entity(
                            AiScheduleExtractionResult.class
                    );
        } catch (Exception e) {
            throw new CustomException(AI_API_ERROR);
        }
    }
}