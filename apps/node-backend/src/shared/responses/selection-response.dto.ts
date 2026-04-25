// application/dtos/shared/selection-response.dto.ts

export interface ISelection {
  value: string; // id
  label: string; // hiển thị
}

export class SelectionResponseDto {
  readonly value: string;
  readonly label: string;

  constructor(data: ISelection) {
    this.value = data.value;
    this.label = data.label;
  }
}