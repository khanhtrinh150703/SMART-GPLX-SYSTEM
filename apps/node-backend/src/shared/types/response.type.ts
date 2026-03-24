export interface StandardResponse<T> {
  success: boolean;
  code: string;       
  statusCode: number; 
  message: string;
  data?: T;           
}

