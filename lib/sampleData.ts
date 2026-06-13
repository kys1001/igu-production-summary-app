import type { ProductionInput } from "./types";

export const emptyProductionInput: ProductionInput = {
  productionDate: "",
  productName: "",
  productionResult: "",
  equipmentIssue: "",
  qualityIssue: "",
  deliveryIssue: "",
  materialIssue: "",
  memo: "",
};

export const sampleProductionInput: ProductionInput = {
  productionDate: "2026-06-10",
  productName: "동 코일 / 냉간압연 후 슬리팅 공정",
  productionResult: "목표 120톤, 실적 112톤, 달성률 93%",
  equipmentIssue:
    "냉간압연 공정에서 장력 조정 필요. 슬리팅 설비 점검으로 약 40분 지연 발생.",
  qualityIssue:
    "일부 코일에서 표면 스크래치와 미세한 변색 확인. 두께는 기준 범위 내이나 외관 재확인 필요.",
  deliveryIssue:
    "A 고객사 납기 일정이 촉박하여 출하 가능 여부를 빠르게 확인해야 함.",
  materialIssue: "특정 규격 원자재 재고가 다음 주 부족할 가능성 있음.",
  memo:
    "품질팀 재검사 진행 중. 생산관리팀은 대체 생산 일정 검토 필요. 영업팀은 고객 안내 문구 준비 필요.",
};
