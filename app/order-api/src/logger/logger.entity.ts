import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Logger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column({ default: true })
  context: boolean;

  @Column()
  timestamp: string;

  @Column()
  pid: number;
}
