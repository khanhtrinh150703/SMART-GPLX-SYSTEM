
export class RowValidationError extends Error {
    public readonly details: string[];

    constructor(defaultMessage: string, details: string[]) {
        super(defaultMessage);
        this.name = 'RowValidationError';
        this.details = details;
    }

    /**
     * @description Combine text mặc định và các lỗi chi tiết (Combine default text and detailed errors)
     */
    public getCombinedMessage(): string {
        return `${this.message}: ${this.details.join(', ')}`;
    }
}