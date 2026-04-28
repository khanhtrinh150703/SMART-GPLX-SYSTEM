// application/dtos/shared/selection-response.dto.ts

export interface ISelection {
  value: string; // id
  label: string; // hiển thị
  orderIndex: number;
}

export class SelectionResponseDto {
  readonly value: string;
  readonly label: string;
  readonly orderIndex: number;

  constructor(data: ISelection) {
    this.value = data.value;
    this.label = data.label;
    this.orderIndex = data.orderIndex;
  }
}