import { NextResponse } from "next/server";
import type {
  DepartmentAction,
  ProductionInput,
  SummaryResponse,
} from "@/lib/types";

export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash"; // 필요 시 사용 가능한 모델명으로 교체
const GEMINI_API_BASE =
  process.env.GEMINI_API_BASE ?? "https://generativelanguage.googleapis.com/v1beta";

const SYSTEM_PROMPT = `
너는 동·동합금 제조기업의 생산관리, 품질관리, 납기관리 업무를 지원하는 AI 업무 보조자다.
AI는 최종 판단을 대신하지 않는다.
입력된 생산일보 메모를 바탕으로 핵심 이슈를 구조화하고, 부서별 확인사항과 회의 안건을 작성한다.
확인되지 않은 원인은 단정하지 말고 "원인 후보" 또는 "추가 확인 필요"로 표시한다.
고객사명, 원가, 세부 조건 등 민감정보가 포함될 수 있으므로 과도한 추정은 하지 않는다.
반드시 유효한 JSON 객체만 응답한다.
`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "사용자_GEMINI_API_KEY") {
      return NextResponse.json(
        {
          message:
            "GEMINI_API_KEY가 설정되어 있지 않습니다. .env.local 또는 Vercel Environment Variables를 확인해 주세요.",
        },
        { status: 500 },
      );
    }

    const input = (await request.json()) as ProductionInput;
    const validationMessage = validateInput(input);

    if (validationMessage) {
      return NextResponse.json({ message: validationMessage }, { status: 400 });
    }

    const geminiResponse = await fetch(
      `${GEMINI_API_BASE}/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: buildUserPrompt(input) }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const detail = await safeReadResponse(geminiResponse);
      console.error("Gemini API request failed:", detail);

      return NextResponse.json(
        {
          message:
            "Gemini API 호출에 실패했습니다. API Key, 결제 상태, 모델명을 확인해 주세요.",
        },
        { status: 502 },
      );
    }

    const data = await geminiResponse.json();
    const content = extractGeminiText(data);

    if (!content || typeof content !== "string") {
      console.error("Gemini response content is empty:", data);
      return NextResponse.json(
        { message: "AI 응답을 읽지 못했습니다. 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    const parsed = parseJsonContent(content);
    const normalized = normalizeSummary(parsed);

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Summarize route failed:", error);

    return NextResponse.json(
      { message: "요약 생성 중 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

function validateInput(input: ProductionInput) {
  if (!input?.productionDate?.trim()) {
    return "생산일자는 필수 입력값입니다.";
  }

  if (!input?.productName?.trim()) {
    return "생산 품목은 필수 입력값입니다.";
  }

  const contentLength = [
    input.productionResult,
    input.equipmentIssue,
    input.qualityIssue,
    input.deliveryIssue,
    input.materialIssue,
    input.memo,
  ]
    .join(" ")
    .trim().length;

  if (contentLength < 30) {
    return "입력 내용이 너무 짧습니다. 생산 실적과 주요 이슈를 조금 더 입력해 주세요.";
  }

  return "";
}

function buildUserPrompt(input: ProductionInput) {
  return `
아래 생산일보 입력값을 바탕으로 생산회의 자료 초안을 작성해 주세요.
응답은 설명 문장 없이 JSON 객체만 반환해 주세요.

JSON 구조:
{
  "productionSummary": "",
  "keyIssues": {
    "equipment": [],
    "quality": [],
    "delivery": [],
    "material": []
  },
  "deliveryImpact": {
    "summary": "",
    "checkPoints": [],
    "customerNoticeNeeded": ""
  },
  "qualityIssue": {
    "facts": [],
    "possibleCauses": [],
    "additionalChecks": [],
    "preventionPoints": []
  },
  "departmentActions": [
    {
      "department": "",
      "actions": []
    }
  ],
  "meetingAgenda": [],
  "managerBrief": ""
}

작성 조건:
- 생산 현황 요약은 3~5줄로 작성
- 주요 이슈는 설비, 품질, 납기, 원자재 이슈로 구분
- 납기 영향 분석에는 고객 납기 영향 요소, 즉시 확인사항, 고객 안내 필요 여부 포함
- 품질 이슈 정리에는 확인된 사실, 원인 후보, 추가 확인사항, 재발방지 검토 포인트 포함
- 부서별 확인사항은 생산관리, 품질팀, 영업팀, 구매/자재, 설비/보전 기준으로 작성
- 생산회의 안건은 5개 작성
- 부서장 보고용 요약문은 5줄 이내로 작성
- 확인되지 않은 원인은 단정하지 말고 "원인 후보" 또는 "추가 확인 필요"로 표시

생산일자: ${input.productionDate}
생산 품목: ${input.productName}
생산 실적: ${input.productionResult}
설비 이슈: ${input.equipmentIssue}
품질 이슈: ${input.qualityIssue}
납기 이슈: ${input.deliveryIssue}
원자재·재고 이슈: ${input.materialIssue}
기타 메모: ${input.memo}
`;
}

function parseJsonContent(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function extractGeminiText(data: unknown) {
  if (!isRecord(data)) return "";

  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  const firstCandidate = candidates[0];
  if (!isRecord(firstCandidate)) return "";

  const content = firstCandidate.content;
  if (!isRecord(content)) return "";

  const parts = Array.isArray(content.parts) ? content.parts : [];
  return parts
    .map((part) =>
      isRecord(part) && typeof part.text === "string" ? part.text : "",
    )
    .filter(Boolean)
    .join("\n")
    .trim();
}

function normalizeSummary(value: unknown): SummaryResponse {
  const raw = isRecord(value) ? value : {};
  const keyIssues = isRecord(raw.keyIssues) ? raw.keyIssues : {};
  const deliveryImpact = isRecord(raw.deliveryImpact) ? raw.deliveryImpact : {};
  const qualityIssue = isRecord(raw.qualityIssue) ? raw.qualityIssue : {};

  return {
    productionSummary: toText(raw.productionSummary),
    keyIssues: {
      equipment: toTextArray(keyIssues.equipment),
      quality: toTextArray(keyIssues.quality),
      delivery: toTextArray(keyIssues.delivery),
      material: toTextArray(keyIssues.material),
    },
    deliveryImpact: {
      summary: toText(deliveryImpact.summary),
      checkPoints: toTextArray(deliveryImpact.checkPoints),
      customerNoticeNeeded: toText(deliveryImpact.customerNoticeNeeded),
    },
    qualityIssue: {
      facts: toTextArray(qualityIssue.facts),
      possibleCauses: toTextArray(qualityIssue.possibleCauses),
      additionalChecks: toTextArray(qualityIssue.additionalChecks),
      preventionPoints: toTextArray(qualityIssue.preventionPoints),
    },
    departmentActions: normalizeDepartmentActions(raw.departmentActions),
    meetingAgenda: toTextArray(raw.meetingAgenda).slice(0, 5),
    managerBrief: toText(raw.managerBrief),
  };
}

function normalizeDepartmentActions(value: unknown): DepartmentAction[] {
  const departments = ["생산관리", "품질팀", "영업팀", "구매/자재", "설비/보전"];
  const rows = Array.isArray(value) ? value : [];
  const mapped = rows
    .map((item) => {
      if (!isRecord(item)) return null;
      return {
        department: toText(item.department),
        actions: toTextArray(item.actions),
      };
    })
    .filter((item): item is DepartmentAction => Boolean(item?.department));

  return departments.map((department) => {
    const found = mapped.find((item) => item.department.includes(department));
    return found ?? { department, actions: ["추가 확인 필요"] };
  });
}

function toText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(String).join("\n").trim();
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toTextArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(toText).filter(Boolean);
  }

  const text = toText(value);
  return text ? [text] : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function safeReadResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}
