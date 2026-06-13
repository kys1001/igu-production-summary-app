"use client";

import {
  AlertCircle,
  ClipboardCopy,
  FileDown,
  Factory,
  FileText,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  TableProperties,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SummaryResponse } from "@/lib/types";

type SummaryResultProps = {
  result: SummaryResponse | null;
  copied: boolean;
  onCopy: () => void;
  onDownloadDoc: () => void;
};

type CardProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  accent?: "blue" | "green" | "amber";
};

const issueLabels = {
  equipment: "설비",
  quality: "품질",
  delivery: "납기",
  material: "원자재",
};

export default function SummaryResult({
  result,
  copied,
  onCopy,
  onDownloadDoc,
}: SummaryResultProps) {
  if (!result) {
    return (
      <section className="flex min-h-[760px] items-center justify-center rounded-lg border border-dashed border-corporate-line bg-white p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-corporate-steel text-corporate-blue">
            <FileText size={30} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-corporate-ink">
            생산일보를 입력하면 AI가 회의자료 초안을 생성합니다.
          </h2>
          <p className="mt-3 text-sm leading-6 text-corporate-muted">
            생산 현황, 이슈, 납기 영향, 품질 확인사항, 부서별 액션을 한 화면에서 확인할 수 있습니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-corporate-line bg-white px-5 py-4 shadow-board">
        <div>
          <p className="text-sm font-extrabold text-corporate-blue">
            AI 생성 결과
          </p>
          <h2 className="mt-1 text-xl font-black text-corporate-ink">
            생산회의 자료 초안
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownloadDoc}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-corporate-navy px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-corporate-blue"
          >
            <FileDown size={17} aria-hidden="true" />
            DOCX 다운로드
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-corporate-blue bg-white px-4 py-2.5 text-sm font-extrabold text-corporate-blue transition hover:bg-blue-50"
          >
            <ClipboardCopy size={17} aria-hidden="true" />
            {copied ? "복사 완료" : "전체 결과 복사"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card icon={Factory} title="1. 생산 현황 요약">
          <p className="whitespace-pre-line text-sm leading-7 text-corporate-ink">
            {result.productionSummary}
          </p>
        </Card>

        <Card icon={AlertCircle} title="2. 주요 이슈" accent="amber">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(result.keyIssues).map(([key, items]) => (
              <IssueGroup
                key={key}
                title={issueLabels[key as keyof typeof issueLabels]}
                items={items}
              />
            ))}
          </div>
        </Card>

        <Card icon={Truck} title="3. 납기 영향 분석" accent="green">
          <p className="text-sm leading-7 text-corporate-ink">
            {result.deliveryImpact.summary}
          </p>
          <SubTitle>즉시 확인사항</SubTitle>
          <BulletList items={result.deliveryImpact.checkPoints} />
          <div className="mt-3 rounded-lg border border-corporate-line bg-corporate-steel px-3 py-2 text-sm font-bold text-corporate-ink">
            고객 안내 필요 여부: {result.deliveryImpact.customerNoticeNeeded}
          </div>
        </Card>

        <Card icon={ShieldCheck} title="4. 품질 이슈 정리">
          <QualityBlock title="확인된 사실" items={result.qualityIssue.facts} />
          <QualityBlock
            title="원인 후보"
            items={result.qualityIssue.possibleCauses}
          />
          <QualityBlock
            title="추가 확인사항"
            items={result.qualityIssue.additionalChecks}
          />
          <QualityBlock
            title="재발방지 검토 포인트"
            items={result.qualityIssue.preventionPoints}
          />
        </Card>
      </div>

      <Card icon={TableProperties} title="5. 부서별 확인사항">
        <div className="overflow-hidden rounded-lg border border-corporate-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-corporate-navy text-white">
              <tr>
                <th className="w-36 px-4 py-3 font-extrabold">부서</th>
                <th className="px-4 py-3 font-extrabold">확인사항</th>
              </tr>
            </thead>
            <tbody>
              {result.departmentActions.map((row) => (
                <tr key={row.department} className="border-t border-corporate-line">
                  <td className="bg-slate-50 px-4 py-3 font-extrabold text-corporate-blue">
                    {row.department}
                  </td>
                  <td className="px-4 py-3">
                    <BulletList items={row.actions} compact />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_1.15fr] gap-4">
        <Card icon={ListChecks} title="6. 생산회의 안건" accent="amber">
          <ol className="space-y-2 text-sm leading-6 text-corporate-ink">
            {result.meetingAgenda.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-corporate-navy text-xs font-black text-white">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card icon={MessageSquareText} title="7. 부서장 보고용 요약문" accent="green">
          <p className="whitespace-pre-line text-base font-semibold leading-8 text-corporate-ink">
            {result.managerBrief}
          </p>
        </Card>
      </div>
    </section>
  );
}

function Card({ icon: Icon, title, children, accent = "blue" }: CardProps) {
  const accents = {
    blue: "bg-blue-50 text-corporate-blue",
    green: "bg-emerald-50 text-corporate-green",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <article className="rounded-lg border border-corporate-line bg-white p-5 shadow-board">
      <div className="mb-4 flex items-center gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>
          <Icon size={19} aria-hidden="true" />
        </span>
        <h3 className="text-base font-black text-corporate-ink">{title}</h3>
      </div>
      {children}
    </article>
  );
}

function IssueGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-corporate-line bg-slate-50 p-3">
      <p className="mb-2 text-sm font-black text-corporate-blue">{title}</p>
      <BulletList items={items} compact />
    </div>
  );
}

function QualityBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3 first:mt-0">
      <SubTitle>{title}</SubTitle>
      <BulletList items={items} compact />
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-sm font-black text-corporate-blue first:mt-0">
      {children}
    </p>
  );
}

function BulletList({
  items,
  compact = false,
}: {
  items: string[];
  compact?: boolean;
}) {
  if (!items.length) {
    return <p className="text-sm text-corporate-muted">추가 확인 필요</p>;
  }

  return (
    <ul className={compact ? "space-y-1" : "mt-2 space-y-2"}>
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-2 text-sm leading-6 text-corporate-ink"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-corporate-amber" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
