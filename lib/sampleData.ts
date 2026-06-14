import type { ProductionInput, ProductionSample } from "./types";

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

export const sampleProductionScenarios: ProductionSample[] = [
  {
    id: "equipment-delay",
    label: "설비 지연",
    description: "냉간압연·슬리팅 설비 점검",
    data: {
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
    },
  },
  {
    id: "quality-recheck",
    label: "품질 재검사",
    description: "황동 스트립 외관·두께 확인",
    data: {
      productionDate: "2026-06-11",
      productName: "황동 스트립 / 열처리 후 정정 및 검사 공정",
      productionResult: "목표 85톤, 실적 82톤, 달성률 96%",
      equipmentIssue:
        "정정기 롤 교체 후 초기 세팅값 확인 필요. 설비 정지는 없었으나 검사 대기 시간이 일부 증가함.",
      qualityIssue:
        "일부 제품에서 가장자리 버와 미세한 두께 편차 의심 항목 확인. 샘플 3건은 재측정 대기 중.",
      deliveryIssue:
        "B 고객사 출하 예정 물량 중 일부가 품질 승인 완료 후 출하 가능함. 금일 오후 승인 여부 확인 필요.",
      materialIssue:
        "주요 원자재 수급은 정상이나 동일 규격 예비재 사용 가능 수량을 재확인해야 함.",
      memo:
        "품질팀은 재측정 결과를 생산관리팀에 공유 필요. 영업팀은 승인 지연 가능성에 대비해 고객 안내 시나리오 준비 필요.",
    },
  },
  {
    id: "delivery-material",
    label: "납기/자재",
    description: "Busbar 소재 납기·재고 리스크",
    data: {
      productionDate: "2026-06-12",
      productName: "Busbar 소재 / 절단 및 포장 출하 준비",
      productionResult: "목표 60톤, 실적 54톤, 달성률 90%",
      equipmentIssue:
        "절단 설비 칼날 마모로 교체 작업 진행. 교체 후 시운전은 완료했으나 첫 생산품 치수 확인 필요.",
      qualityIssue:
        "절단면 버 발생 가능성이 있어 초도품 외관 검사 강화 필요. 현재 확정 불량은 없음.",
      deliveryIssue:
        "C 고객사 긴급 출하 요청 물량이 있어 금일 잔업 여부와 포장 완료 시간을 확인해야 함.",
      materialIssue:
        "고전도 규격 원자재 입고가 하루 지연될 가능성 있음. 대체 규격 사용 가능 여부와 재고 전환 검토 필요.",
      memo:
        "구매/자재팀은 입고 예정 시간을 재확인하고, 생산관리팀은 잔업 편성 가능 여부를 검토해야 함. 영업팀은 출하 가능 시간대를 고객에게 안내할 준비 필요.",
    },
  },
];
