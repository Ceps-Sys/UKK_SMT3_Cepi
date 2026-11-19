#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3/contract';
import endContract from '../../snapshots/5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
  unique,
} from '@prisma/orm-mysql/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        table: 'users',
        columns: [
          col('created_at', 'datetime(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'mysql/datetime@1', typeParams: { precision: 3 } },
          }),
          col('email', 'varchar(191)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 191 } },
          }),
          col('fullname', 'varchar(191)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 191 } },
          }),
          col('id', 'int', {
            notNull: true,
            default: fn(sql`autoincrement()`),
            codecRef: { codecId: 'mysql/int@1' },
          }),
          col('password', 'varchar(191)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 191 } },
          }),
          col('role', 'varchar(191)', {
            notNull: true,
            default: lit('staff'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 191 } },
          }),
          col('token', 'varchar(191)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 191 } },
          }),
          col('updated_at', 'datetime(3)', {
            notNull: true,
            codecRef: { codecId: 'mysql/datetime@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id']), unique(['email'], { name: 'users_email_key' })],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
