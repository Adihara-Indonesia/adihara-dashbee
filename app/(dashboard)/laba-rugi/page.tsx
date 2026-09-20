import { createClient } from "@/lib/supabase/server";
import { getLabaRugiReport } from "@/lib/laba-rugi/queries";
import { LabaRugiTable } from "@/components/laba-rugi/laba-rugi-table";

export default async function LabaRugiPage() {
  const supabase = await createClient();
  const report = await getLabaRugiReport(supabase);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h1 className="font-serif text-xl font-semibold text-gray-900">
          Laba Rugi
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Pendapatan − HPP = Laba Kotor; Laba Kotor − Beban Operasional = Laba
          Bersih. Dihitung otomatis dari data Penjualan, Pengeluaran, dan
          Pemasukan — tidak dapat diubah langsung di sini.
        </p>
      </div>

      <LabaRugiTable report={report} />
    </div>
  );
}
