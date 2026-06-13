"use client";

import { useMemo, useState } from "react";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { ClipboardCheck, Factory, FileBarChart2, Shield } from "lucide-react";
import ProductionForm from "@/components/ProductionForm";
import SummaryResult from "@/components/SummaryResult";
import { emptyProductionInput, sampleProductionInput } from "@/lib/sampleData";
import type { ApiErrorResponse, ProductionInput, SummaryResponse } from "@/lib/types";

export default function Home() {
  const [input, setInput] = useState<ProductionInput>(() => ({
    ...emptyProductionInput,
  }));
  const [result, setResult] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const memoLength = useMemo(() => {
    return [
      input.productionResult,
      input.equipmentIssue,
      input.qualityIssue,
      input.deliveryIssue,
      input.materialIssue,
      input.memo,
    ].join(" ").trim().length;
  }, [input]);

  function validate() {
    if (!input.productionDate.trim()) {
      return "생산일자는 필수 입력값입니다.";
    }

    if (!input.productName.trim()) {
      return "생산 품목은 필수 입력값입니다.";
    }

    if (memoLength < 30) {
      return "생산 실적, 이슈, 메모 내용을 조금 더 입력해 주세요. 최소 30자 이상이면 좋습니다.";
    }

    return "";
  }

  async function generateSummary() {
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = (await response.json()) as SummaryResponse | ApiErrorResponse;

      if (!response.ok) {
        throw new Error(
          "message" in data
            ? data.message
            : "AI 요약 생성 중 문제가 발생했습니다.",
        );
      }

      setResult(data as SummaryResponse);
    } catch (err) {
      console.error("Summary generation failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "AI 요약 생성 중 알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;

    const markdown = toMarkdown(result);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function downloadDocxFile() {
    if (!result) return;

    const docxDocument = buildDocxDocument(result, input);
    const blob = await Packer.toBlob(docxDocument);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = input.productionDate || new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `이구산업_생산일보_요약_${date}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function resetAll() {
    setInput({ ...emptyProductionInput });
    setResult(null);
    setError("");
    setCopied(false);
  }

  function loadSample() {
    setInput({ ...sampleProductionInput });
    setResult(null);
    setError("");
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-6 py-6">
      <div className="mx-auto max-w-[1500px]">
        <section className="mb-5 overflow-hidden rounded-lg border border-corporate-line bg-white shadow-board">
          <div className="grid grid-cols-[1.2fr_0.8fr]">
            <div className="p-8">
              <div className="flex items-center gap-3 text-sm font-black text-corporate-blue">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-corporate-navy text-white">
                  <Factory size={19} aria-hidden="true" />
                </span>
                IGU INDUSTRIAL DAILY REPORT
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-normal text-corporate-ink">
                이구산업 생산일보 요약 자동화
              </h1>
              <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-corporate-muted">
                생산 메모와 일일 실적을 입력하면 회의자료와 핵심 이슈를 자동 정리합니다.
              </p>
            </div>
            <div className="grid grid-cols-3 border-l border-corporate-line bg-corporate-navy text-white">
              <HeroStat icon={FileBarChart2} label="요약" value="7종" />
              <HeroStat icon={ClipboardCheck} label="회의" value="안건" />
              <HeroStat icon={Shield} label="API" value="Gemini" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-[540px_minmax(0,1fr)] gap-5">
          <ProductionForm
            value={input}
            error={error}
            loading={loading}
            onChange={setInput}
            onLoadSample={loadSample}
            onReset={resetAll}
            onSubmit={generateSummary}
          />
          <SummaryResult
            result={result}
            copied={copied}
            onCopy={copyResult}
            onDownloadDoc={downloadDocxFile}
          />
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-corporate-muted">
          실제 운영 시 고객사명, 원가, 계약조건, 도면 등 민감정보는 사내 보안 기준에 따라 입력 여부를 판단해야 합니다.
        </p>
      </div>
    </main>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileBarChart2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col justify-center border-r border-white/15 px-5 last:border-r-0">
      <Icon size={24} className="text-corporate-amber" aria-hidden="true" />
      <span className="mt-4 text-3xl font-black">{value}</span>
      <span className="mt-1 text-sm font-bold text-blue-100">{label}</span>
    </div>
  );
}

function toMarkdown(result: SummaryResponse) {
  const keyIssueLines = [
    ["설비", result.keyIssues.equipment],
    ["품질", result.keyIssues.quality],
    ["납기", result.keyIssues.delivery],
    ["원자재", result.keyIssues.material],
  ]
    .map(([label, items]) => {
      const list = (items as string[]).map((item) => `- ${item}`).join("\n");
      return `### ${label}\n${list || "- 추가 확인 필요"}`;
    })
    .join("\n\n");

  const departmentTable = [
    "| 부서 | 확인사항 |",
    "| --- | --- |",
    ...result.departmentActions.map(
      (row) => `| ${row.department} | ${row.actions.join("<br>")} |`,
    ),
  ].join("\n");

  return `# 생산일보 AI 요약

## 1. 생산 현황 요약
${result.productionSummary}

## 2. 주요 이슈
${keyIssueLines}

## 3. 납기 영향 분석
${result.deliveryImpact.summary}

### 즉시 확인사항
${result.deliveryImpact.checkPoints.map((item) => `- ${item}`).join("\n")}

### 고객 안내 필요 여부
${result.deliveryImpact.customerNoticeNeeded}

## 4. 품질 이슈 정리
### 확인된 사실
${result.qualityIssue.facts.map((item) => `- ${item}`).join("\n")}

### 원인 후보
${result.qualityIssue.possibleCauses.map((item) => `- ${item}`).join("\n")}

### 추가 확인사항
${result.qualityIssue.additionalChecks.map((item) => `- ${item}`).join("\n")}

### 재발방지 검토 포인트
${result.qualityIssue.preventionPoints.map((item) => `- ${item}`).join("\n")}

## 5. 부서별 확인사항
${departmentTable}

## 6. 생산회의 안건
${result.meetingAgenda.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## 7. 부서장 보고용 요약문
${result.managerBrief}
`;
}

function buildDocxDocument(result: SummaryResponse, input: ProductionInput) {
  return new Document({
    creator: "이구산업 생산일보 요약 자동화",
    title: "이구산업 생산일보 AI 요약",
    description: "생산일보 AI 요약 결과",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: "이구산업 생산일보 AI 요약",
                bold: true,
                color: "0B2F5B",
                size: 36,
              }),
            ],
          }),
          makeMetaTable(input),
          sectionHeading("1. 생산 현황 요약"),
          ...textParagraphs(result.productionSummary),
          sectionHeading("2. 주요 이슈"),
          makeKeyIssuesTable(result),
          sectionHeading("3. 납기 영향 분석"),
          ...textParagraphs(result.deliveryImpact.summary),
          subHeading("즉시 확인사항"),
          ...listParagraphs(result.deliveryImpact.checkPoints),
          normalParagraph(
            `고객 안내 필요 여부: ${
              result.deliveryImpact.customerNoticeNeeded || "추가 확인 필요"
            }`,
            true,
          ),
          sectionHeading("4. 품질 이슈 정리"),
          subHeading("확인된 사실"),
          ...listParagraphs(result.qualityIssue.facts),
          subHeading("원인 후보"),
          ...listParagraphs(result.qualityIssue.possibleCauses),
          subHeading("추가 확인사항"),
          ...listParagraphs(result.qualityIssue.additionalChecks),
          subHeading("재발방지 검토 포인트"),
          ...listParagraphs(result.qualityIssue.preventionPoints),
          sectionHeading("5. 부서별 확인사항"),
          makeDepartmentTable(result),
          sectionHeading("6. 생산회의 안건"),
          ...numberedParagraphs(result.meetingAgenda),
          sectionHeading("7. 부서장 보고용 요약문"),
          ...textParagraphs(result.managerBrief),
        ],
      },
    ],
  });
}

function sectionHeading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: "124C8C",
        size: 26,
      }),
    ],
  });
}

function subHeading(text: string) {
  return new Paragraph({
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: "0B2F5B",
        size: 22,
      }),
    ],
  });
}

function normalParagraph(text: string, bold = false) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: text || "추가 확인 필요",
        bold,
        size: 21,
      }),
    ],
  });
}

function textParagraphs(value: string) {
  const lines = value
    ? value.split("\n").map((line) => line.trim()).filter(Boolean)
    : ["추가 확인 필요"];

  return lines.map((line) => normalParagraph(line));
}

function listParagraphs(items: string[]) {
  const lines = items.length ? items : ["추가 확인 필요"];

  return lines.map(
    (item) =>
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `• ${item}`,
            size: 21,
          }),
        ],
      }),
  );
}

function numberedParagraphs(items: string[]) {
  const lines = items.length ? items : ["추가 확인 필요"];

  return lines.map(
    (item, index) =>
      new Paragraph({
        spacing: { after: 70 },
        children: [
          new TextRun({
            text: `${index + 1}. ${item}`,
            size: 21,
          }),
        ],
      }),
  );
}

function makeMetaTable(input: ProductionInput) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      makeTableRow("생산일자", input.productionDate || "-"),
      makeTableRow("생산 품목", input.productName || "-"),
      makeTableRow("생산 실적", input.productionResult || "-"),
    ],
  });
}

function makeKeyIssuesTable(result: SummaryResponse) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      makeTableRow("설비", result.keyIssues.equipment),
      makeTableRow("품질", result.keyIssues.quality),
      makeTableRow("납기", result.keyIssues.delivery),
      makeTableRow("원자재", result.keyIssues.material),
    ],
  });
}

function makeDepartmentTable(result: SummaryResponse) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: result.departmentActions.map((row) =>
      makeTableRow(row.department, row.actions),
    ),
  });
}

function makeTableRow(label: string, value: string | string[]) {
  const values = Array.isArray(value) ? value : [value];

  return new TableRow({
    children: [
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { fill: "E8EEF5" },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                color: "0B2F5B",
                size: 21,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 78, type: WidthType.PERCENTAGE },
        children: values.length
          ? values.map((item) => normalParagraph(item))
          : [normalParagraph("추가 확인 필요")],
      }),
    ],
  });
}
