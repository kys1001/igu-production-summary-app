"use client";

import {
  Boxes,
  CalendarDays,
  Database,
  Factory,
  Gauge,
  NotebookText,
  PackageSearch,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProductionInput } from "@/lib/types";

type ProductionFormProps = {
  value: ProductionInput;
  error: string;
  loading: boolean;
  onChange: (nextValue: ProductionInput) => void;
  onLoadSample: () => void;
  onReset: () => void;
  onSubmit: () => void;
};

type FieldProps = {
  icon: LucideIcon;
  label: string;
  name: keyof ProductionInput;
  placeholder: string;
  value: string;
  required?: boolean;
  rows?: number;
  type?: "date" | "text";
  onChange: (name: keyof ProductionInput, value: string) => void;
};

const fields: Array<Omit<FieldProps, "value" | "onChange">> = [
  {
    icon: CalendarDays,
    label: "생산일자",
    name: "productionDate",
    placeholder: "2026-06-10",
    required: true,
    type: "date",
  },
  {
    icon: Factory,
    label: "생산 품목",
    name: "productName",
    placeholder: "동 코일, 황동 스트립, 인청동, Busbar 소재",
    required: true,
    type: "text",
  },
  {
    icon: Gauge,
    label: "생산 실적",
    name: "productionResult",
    placeholder: "목표 120톤 / 실적 112톤 / 달성률 93%",
    rows: 3,
  },
  {
    icon: Wrench,
    label: "설비 이슈",
    name: "equipmentIssue",
    placeholder: "압연기 점검으로 40분 지연, 슬리팅 설비 장력 조정 필요",
    rows: 3,
  },
  {
    icon: ShieldAlert,
    label: "품질 이슈",
    name: "qualityIssue",
    placeholder: "일부 코일 표면 스크래치 확인, 두께 편차 재검사 필요",
    rows: 3,
  },
  {
    icon: Truck,
    label: "납기 이슈",
    name: "deliveryIssue",
    placeholder: "A 고객사 납기 일정 촉박, 출하 가능 여부 확인 필요",
    rows: 3,
  },
  {
    icon: PackageSearch,
    label: "원자재·재고 이슈",
    name: "materialIssue",
    placeholder: "구리 가격 상승, 특정 규격 원자재 재고 부족 가능성",
    rows: 3,
  },
  {
    icon: NotebookText,
    label: "기타 메모",
    name: "memo",
    placeholder: "품질팀 재검사 진행 중, 영업팀 고객 안내 대기",
    rows: 4,
  },
];

export default function ProductionForm({
  value,
  error,
  loading,
  onChange,
  onLoadSample,
  onReset,
  onSubmit,
}: ProductionFormProps) {
  function updateField(name: keyof ProductionInput, nextFieldValue: string) {
    onChange({ ...value, [name]: nextFieldValue });
  }

  return (
    <section className="min-w-0 max-w-full rounded-lg border border-corporate-line bg-white p-4 shadow-board sm:p-5">
      <div className="mb-5 flex flex-col gap-4 border-b border-corporate-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-corporate-blue">
            <Boxes size={18} aria-hidden="true" />
            생산일보 입력
          </div>
          <h2 className="mt-2 text-xl font-black text-corporate-ink">
            일일 생산 메모
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={onLoadSample}
            onClick={onLoadSample}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-corporate-blue bg-blue-50 px-3 text-sm font-extrabold text-corporate-blue transition hover:bg-blue-100"
          >
            <Database size={16} aria-hidden="true" />
            예시
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-corporate-line text-corporate-muted transition hover:border-corporate-blue hover:text-corporate-blue"
            title="초기화"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.slice(0, 2).map((field) => (
          <Field
            key={field.name}
            {...field}
            value={value[field.name]}
            onChange={updateField}
          />
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {fields.slice(2).map((field) => (
          <Field
            key={field.name}
            {...field}
            value={value[field.name]}
            onChange={updateField}
          />
        ))}
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.35fr]">
        <button
          type="button"
          onPointerDown={onLoadSample}
          onClick={onLoadSample}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-corporate-blue bg-white px-4 py-3 text-sm font-extrabold text-corporate-blue transition hover:bg-blue-50"
        >
          <Database size={17} aria-hidden="true" />
          예시 데이터 불러오기
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-corporate-navy px-4 py-3 text-sm font-extrabold text-white transition hover:bg-corporate-blue disabled:bg-slate-300"
        >
          {loading ? <span className="spinner" aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}
          {loading ? "생성 중..." : "AI 요약 생성"}
        </button>
      </div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  name,
  placeholder,
  required,
  rows,
  type = "text",
  value,
  onChange,
}: FieldProps) {
  const sharedClassName =
    "mt-2 w-full min-w-0 max-w-full rounded-lg border border-corporate-line bg-white px-3 py-2.5 text-sm leading-6 text-corporate-ink outline-none transition placeholder:text-slate-400 focus:border-corporate-blue focus:ring-4 focus:ring-blue-100";

  return (
    <label className="block min-w-0" htmlFor={name}>
      <span className="flex items-center gap-2 text-sm font-extrabold text-corporate-ink">
        <Icon size={16} className="text-corporate-blue" aria-hidden="true" />
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </span>
      {rows ? (
        <textarea
          className={sharedClassName}
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
        />
      ) : (
        <input
          className={`${sharedClassName} h-11`}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
        />
      )}
    </label>
  );
}
