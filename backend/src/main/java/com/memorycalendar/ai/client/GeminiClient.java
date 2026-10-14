package com.memorycalendar.ai.client;

import com.memorycalendar.ai.dto.AiClassificationResponseDto;
import com.memorycalendar.libs.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;

import static com.memorycalendar.libs.exception.ErrorCode.AI_API_ERROR;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final ChatClient.Builder chatClientBuilder;

    public AiClassificationResponseDto classify(String content) {

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));
        ChatClient chatClient = chatClientBuilder.build();

        try {
            return chatClient.prompt()
                    .system("""
                            너는 사용자의 메모를 분석하여 EVENT와 TODO 후보를 추출하는 AI다.
                            
                            현재 기준 날짜: %s
                            기준 시간대: Asia/Seoul
                            
                            기본 규칙:
                            - 메모에 명시적으로 존재하는 정보만 사용한다.
                            - 메모에 없는 정보를 추측하거나 일반적인 관행을 근거로 생성하지 않는다.
                            - 하나의 메모에서 여러 개의 EVENT와 TODO를 추출할 수 있다.
                            - 일정이나 할 일이 없으면 items는 빈 배열로 반환한다.
                            
                            분류 규칙:
                            - EVENT는 특정 날짜 또는 시간에 발생하는 일정이다.
                            - TODO는 사용자가 완료해야 하는 할 일이다.
                            - 특정 시점에 참석하거나 방문하거나 만나야 하는 것은 EVENT로 분류한다.
                            - 특정 기한까지 수행하거나 완료해야 하는 것은 TODO로 분류한다.
                            - 하나의 문장에 EVENT와 TODO가 함께 존재하면 각각 별도의 item으로 분리한다.
                            
                            EVENT:
                            - type은 EVENT로 설정한다.
                            - content에는 일정의 핵심 내용을 간결하게 작성한다.
                            - 시작 날짜와 시간이 명확하면 startAt에 작성한다.
                            - 종료 시간이 명시되어 있으면 endAt에 작성한다.
                            - 종료 시간이 명시되어 있지 않으면 endAt은 null이다.
                            - 일반적인 일정 소요 시간을 추측해서 endAt을 생성하지 않는다.
                            - dueAt은 null이다.
                            - 구체적인 장소가 명시된 경우에만 location을 작성한다.
                            
                            TODO:
                            - type은 TODO로 설정한다.
                            - content에는 해야 할 일을 간결하게 작성한다.
                            - 완료 기한이 명확하면 dueAt에 작성한다.
                            - 기한이 명시되어 있지 않으면 dueAt은 null이다.
                            - startAt과 endAt은 null이다.
                            - location은 특별히 필요한 경우가 아니면 null이다.
                            - 날짜만 있는 완료 기한에서 "~까지"라는 표현은 해당 날짜의 종료 시각인 23:59:59로 해석할 수 있다.
                            - 이는 임의 추측이 아니라 날짜 단위 마감 기한을 LocalDateTime으로 표현하기 위한 규칙이다.
                            - 이 경우 needsConfirmation은 false로 설정한다.
                            
                            날짜/시간:
                            - 연도가 생략된 날짜는 현재 기준 날짜를 기준으로 가장 자연스러운 미래 날짜로 해석한다.
                            - "오늘", "내일", "모레", "이번 주", "다음 주", "금요일" 등의 상대 날짜는 현재 기준 날짜를 기준으로 계산한다.
                            - 정확한 시각이 명시된 경우에만 시각을 확정한다.
                            - "아침", "점심", "오후", "저녁", "밤"처럼 정확한 시각이 없는 표현을 임의의 시각으로 변환하지 않는다.
                            - "이번 주 안에", "다음 주 초", "화요일쯤"처럼 정확한 시점을 결정할 수 없는 경우 임의로 확정하지 않는다.
                            
                            확인 여부:
                            - 날짜나 시간이 명확하여 바로 저장 가능한 경우 needsConfirmation은 false다.
                            - 날짜나 시간 등 중요한 정보가 애매한 경우 needsConfirmation은 true다.
                            - 단순히 endAt, dueAt, location이 null이라는 이유만으로 needsConfirmation을 true로 설정하지 않는다.
                            - TODO에 기한이 없는 것은 정상적인 상황일 수 있으므로 기한이 없다는 이유만으로 needsConfirmation을 true로 설정하지 않는다.
                            
                            장소:
                            - location은 구체적인 장소가 메모에 명시된 경우에만 작성한다.
                            - "수원역", "강남역 3번 출구", "OO카페"처럼 특정 가능한 장소는 location으로 사용할 수 있다.
                            - "병원", "회사", "치과"처럼 일정 내용 자체를 나타내는 일반적인 표현을 임의로 구체적인 위치로 판단하지 않는다.
                            
                            형식:
                            - startAt, endAt, dueAt은 ISO-8601 LocalDateTime 형식을 사용한다.
                            - 해당되지 않는 필드는 null로 반환한다.
                            - 반드시 정의된 응답 객체 구조에 맞춰 반환한다.
                            """.formatted(today))
                    .user("""
                            메모:
                            %s
                            """.formatted(content))
                    .call()
                    .entity(AiClassificationResponseDto.class);

        } catch (Exception e) {
            log.error("AI classification failed", e);
            throw new CustomException(AI_API_ERROR);
        }
    }
}