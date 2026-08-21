from typing import Literal
from pydantic import BaseModel, Field


class ChatMessageItem(BaseModel):
    role: Literal["user", "model", "assistant", "system"]
    text: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user's current input message")
    history: list[ChatMessageItem] = Field(default_factory=list, description="Previous conversation turns")
    device_id: str = Field(default="esp32_01", description="Target device ID for telemetry/tools")
    reasoning_effort: str = Field(default="Deep", description="Reasoning depth: Low, Medium, High, Deep")


class ToolCallDetail(BaseModel):
    name: str
    arguments: dict
    result: dict


class ChatResponse(BaseModel):
    text: str
    thought: str | None = None
    tool_calls: list[ToolCallDetail] = Field(default_factory=list)
    tokens: int | None = None
    status: str = "ok"
