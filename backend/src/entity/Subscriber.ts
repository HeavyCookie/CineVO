import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Subscriber {
  @PrimaryColumn()
  public email: string

  @CreateDateColumn({type: 'timestamptz'})
  public createdAt: Date
}
