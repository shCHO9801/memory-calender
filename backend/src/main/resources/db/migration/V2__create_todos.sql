CREATE TABLE todos
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    note_id      BIGINT,
    content      VARCHAR(255) NOT NULL,
    due_at       TIMESTAMP,
    status       VARCHAR(20)  NOT NULL DEFAULT 'TODO',
    completed_at TIMESTAMP,
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL,

    CONSTRAINT fk_todos_user
        FOREIGN KEY (user_id)
            REFERENCES users (id),

    CONSTRAINT fk_todos_note
        FOREIGN KEY (note_id)
            REFERENCES notes (id)
);