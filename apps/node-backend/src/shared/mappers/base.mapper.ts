// /**
//  * @description Interface quy định các hành vi bắt buộc.
//  * E: Entity, R: Record (camelCase), D: DTO
//  */
// export interface IMapper<E, R, D> {
//   toDomain(raw: R): E;
//   toPersistence(entity: E): R;
//   toResponse(entity: E): D;
// }

// /**
//  * @description Lớp cơ sở áp đặt quy tắc chung cho mọi Mapper.
//  */
// export abstract class BaseMapper<E, R, D> implements IMapper<E, R, D> {
//   abstract toDomain(raw: R): E;
//   abstract toPersistence(entity: E): R;
//   abstract toResponse(entity: E): D;

//   /**
//    * @description Hỗ trợ chuyển đổi danh sách nhanh chóng.
//    */
//   public toResponseList(entities: E[]): D[] {
//     return entities.map((e) => this.toResponse(e));
//   }
// }


/**
 * @description Lớp cơ sở hỗ trợ Static Mapping với Type Safety tuyệt đối.
 */
export abstract class BaseMapper {
  /**
   * @description Chuyển đổi danh sách Record sang danh sách Entity.
   * "this" ép kiểu cho Class con phải có hàm static toDomain.
   */
  public static toDomainList<R, E>(
    this: { toDomain(raw: R): E }, 
    records: R[]
  ): E[] {
    return records.map((raw) => this.toDomain(raw));
  }

  /**
   * @description Chuyển đổi danh sách Entity sang danh sách DTO.
   * "this" ép kiểu cho Class con phải có hàm static toResponse.
   */
  public static toResponseList<E, D>(
    this: { toResponse(entity: E): D }, 
    entities: E[]
  ): D[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}