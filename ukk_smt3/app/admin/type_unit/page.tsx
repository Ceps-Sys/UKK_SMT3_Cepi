'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

interface TypeUnitItem {
  id_unit_type: number;
  nama_type_unit: string;
  branch_id: string;
  total_facilities: number;
}

export default function TypeUnitPage() {
  const router = useRouter();
  const [units, setUnits] = useState<TypeUnitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaUnit, setNamaUnit] = useState('');
  const [branchId, setBranchId] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadUnits = async () => {
    try {
      const res = await fetch('/api/type', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Gagal memuat data type unit.');
      }
      setUnits(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data type unit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUnit.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_type_unit: namaUnit.trim(),
          branch_id: branchId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Gagal menambahkan type unit.');
      }

      setNamaUnit('');
      await loadUnits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan type unit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (unit: TypeUnitItem) => {
    if (!confirm(`Yakin ingin menghapus type unit "${unit.nama_type_unit}"?`)) return;

    setDeletingId(unit.id_unit_type);
    setError('');
    try {
      const res = await fetch(`/api/type/${unit.id_unit_type}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Gagal menghapus type unit.');
      }
      await loadUnits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus type unit.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Type Unit Management</h1>
        <p className="text-sm text-muted-foreground">
          Klik salah satu baris tipe unit untuk mengatur daftar fasilitas (checkbox).
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          Error: {error}
        </p>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Nama type unit (contoh: Penthouse)"
          value={namaUnit}
          onChange={(e) => setNamaUnit(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="1">Branch 1</option>
          <option value="2">Branch 2</option>
        </select>
        <Button type="submit" disabled={submitting}>
          <Plus className="w-4 h-4 mr-2" />
          {submitting ? 'Menyimpan...' : 'Tambah Type Unit'}
        </Button>
      </form>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">No</TableHead>
              <TableHead>Nama Type Unit</TableHead>
              <TableHead className="w-36">Branch</TableHead>
              <TableHead className="w-48">Fasilitas Terpasang</TableHead>
              <TableHead className="w-56 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Memuat data type unit...
                </TableCell>
              </TableRow>
            ) : units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Belum ada data type unit.
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit, index) => (
                <TableRow
                  key={unit.id_unit_type}
                  onClick={() =>
                    router.push(`/admin/type_unit/form/${unit.id_unit_type}`)
                  }
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{unit.nama_type_unit}</TableCell>
                  <TableCell>Branch {unit.branch_id}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {unit.total_facilities} fasilitas
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/type_unit/form/${unit.id_unit_type}`);
                        }}
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Atur Fasilitas
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={deletingId === unit.id_unit_type}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(unit);
                        }}
                        title="Hapus type unit"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 