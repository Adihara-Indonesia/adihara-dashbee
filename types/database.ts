export type UserRole = "owner" | "admin" | "staff";
export type LeadSource = "google_sso" | "email_password";

export interface Database {
  public: {
    Tables: {
      whitelist: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          email: string;
          source: LeadSource;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source: LeadSource;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: LeadSource;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      business_info: {
        Row: {
          id: string;
          business_name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      /**
       * Aligned to the "purchase" reference sheet: Kode Produk, Nama Produk,
       * Kategori, Warna, Ukuran, Harga Beli (HPP), Harga Jual, Stok Awal.
       * One row per SKU — product master plus its opening stock.
       */
      purchases: {
        Row: {
          id: string;
          purchase_date: string;
          product_code: string;
          product_name: string;
          category: string | null;
          color: string | null;
          size: string | null;
          initial_stock: number;
          unit_cost: number;
          sell_price: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          purchase_date?: string;
          product_code: string;
          product_name: string;
          category?: string | null;
          color?: string | null;
          size?: string | null;
          initial_stock?: number;
          unit_cost: number;
          sell_price: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          purchase_date?: string;
          product_code?: string;
          product_name?: string;
          category?: string | null;
          color?: string | null;
          size?: string | null;
          initial_stock?: number;
          unit_cost?: number;
          sell_price?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "purchases_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      /**
       * Aligned to the "sales" reference sheet: Tanggal, No. Order, Sales
       * Channel, Kode Produk, Nama Produk, Warna, Ukuran, Qty, Harga
       * Jual/Unit, Total Penjualan, HPP/Unit, Total HPP, Laba Kotor.
       * total_sales, total_cost, and gross_profit are DB-generated columns —
       * they're never sent on insert/update.
       */
      sales: {
        Row: {
          id: string;
          sale_date: string;
          order_no: string;
          sales_channel: string;
          product_code: string;
          product_name: string;
          color: string | null;
          size: string | null;
          quantity: number;
          unit_price: number;
          total_sales: number;
          unit_cost: number;
          total_cost: number;
          gross_profit: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_date: string;
          order_no: string;
          sales_channel: string;
          product_code: string;
          product_name: string;
          color?: string | null;
          size?: string | null;
          quantity: number;
          unit_price: number;
          unit_cost: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_date?: string;
          order_no?: string;
          sales_channel?: string;
          product_code?: string;
          product_name?: string;
          color?: string | null;
          size?: string | null;
          quantity?: number;
          unit_price?: number;
          unit_cost?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sales_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      /**
       * Aligned to the "stock opname" reference sheet: Kode Produk, Nama
       * Produk, Warna, Ukuran, Stok Awal, Total Terjual, Stok Sistem, Stok
       * Fisik (hitung gudang), Selisih, Keterangan. system_stock and
       * difference are DB-generated columns.
       */
      stock_opname: {
        Row: {
          id: string;
          count_date: string;
          product_code: string;
          product_name: string;
          color: string | null;
          size: string | null;
          initial_stock: number;
          total_sold: number;
          system_stock: number;
          physical_stock: number;
          difference: number;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          count_date?: string;
          product_code: string;
          product_name: string;
          color?: string | null;
          size?: string | null;
          initial_stock: number;
          total_sold?: number;
          physical_stock: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          count_date?: string;
          product_code?: string;
          product_name?: string;
          color?: string | null;
          size?: string | null;
          initial_stock?: number;
          total_sold?: number;
          physical_stock?: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stock_opname_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      /**
       * Aligned to the "Pengeluaran" reference sheet: Tanggal, Kategori,
       * Deskripsi, Jumlah. One row per operating-expense entry.
       */
      expenses: {
        Row: {
          id: string;
          expense_date: string;
          category: string;
          description: string;
          amount: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_date?: string;
          category: string;
          description?: string;
          amount: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_date?: string;
          category?: string;
          description?: string;
          amount?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      /**
       * Aligned to the "Pemasukan Lain-lain" section of the reference sheet's
       * "Pemasukan" tab: Tanggal, Sumber, Deskripsi, Jumlah. The per-channel
       * per-month sales summary in that same tab is computed from `sales`
       * instead of stored here.
       */
      other_income: {
        Row: {
          id: string;
          income_date: string;
          source: string;
          description: string;
          amount: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          income_date?: string;
          source: string;
          description?: string;
          amount: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          income_date?: string;
          source?: string;
          description?: string;
          amount?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "other_income_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      lead_source: LeadSource;
    };
    Functions: {
      is_whitelisted: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Whitelist = Tables<"whitelist">;
export type Lead = Tables<"leads">;
export type Profile = Tables<"profiles">;
export type BusinessInfo = Tables<"business_info">;
export type Purchase = Tables<"purchases">;
export type Sale = Tables<"sales">;
export type StockOpname = Tables<"stock_opname">;
export type Expense = Tables<"expenses">;
export type OtherIncome = Tables<"other_income">;
