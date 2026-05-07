// application/dtos/shared/selection-response.dto.ts

export interface ISelectionResponseDTO {
  value: string; // id
  label: string; // hiển thị
  orderIndex: number;
}

export class SelectionResponseDTO {
  readonly value: string;
  readonly label: string;
  readonly orderIndex: number;

  constructor(data: ISelectionResponseDTO) {
    this.value = data.value;
    this.label = data.label;
    this.orderIndex = data.orderIndex;
  }
}