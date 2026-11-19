#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3/contract';
import startContract from '../../snapshots/5dc697865cfc0242a899c0d819a26d9da565b56da341e99b63284187b818d8d3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9f7e9b0cc72e36a93f7585d8551d41e8554514f414017500258827e1f9c5bd61/contract';
import endContract from '../../snapshots/9f7e9b0cc72e36a93f7585d8551d41e8554514f414017500258827e1f9c5bd61/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-mysql/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        table: 'users',
        column: col('kode_user', 'varchar(191)', {
          codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 191 } },
        }),
      }),
      this.addUnique({ table: 'users', name: 'users_kode_user_key', columns: ['kode_user'] }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
