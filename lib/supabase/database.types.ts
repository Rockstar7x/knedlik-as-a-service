export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      meal_ingredients: {
        Row: {
          id: string;
          meal_id: string;
          name: string;
          quantity: number;
          unit: Database["public"]["Enums"]["unit"];
        };
        Insert: {
          id?: string;
          meal_id: string;
          name: string;
          quantity: number;
          unit: Database["public"]["Enums"]["unit"];
        };
        Update: {
          id?: string;
          meal_id?: string;
          name?: string;
          quantity?: number;
          unit?: Database["public"]["Enums"]["unit"];
        };
        Relationships: [
          {
            foreignKeyName: "meal_ingredients_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          },
        ];
      };
      meal_plans: {
        Row: {
          allergens: Database["public"]["Enums"]["allergen"][];
          appliances: Database["public"]["Enums"]["appliance"][];
          categories: Database["public"]["Enums"]["category"][];
          cooking_skill: Database["public"]["Enums"]["cooking_skill"];
          created_at: string;
          daily_kcal_target: number | null;
          diet: Database["public"]["Enums"]["diet"];
          disliked_ingredients: string[];
          id: string;
          max_prep_minutes: number | null;
          meal_types: Database["public"]["Enums"]["meal_type"][];
          note: string | null;
          servings: number;
          user_id: string;
          week_start: string;
          weekly_budget_czk: number | null;
        };
        Insert: {
          allergens: Database["public"]["Enums"]["allergen"][];
          appliances: Database["public"]["Enums"]["appliance"][];
          categories: Database["public"]["Enums"]["category"][];
          cooking_skill: Database["public"]["Enums"]["cooking_skill"];
          created_at?: string;
          daily_kcal_target?: number | null;
          diet: Database["public"]["Enums"]["diet"];
          disliked_ingredients: string[];
          id?: string;
          max_prep_minutes?: number | null;
          meal_types: Database["public"]["Enums"]["meal_type"][];
          note?: string | null;
          servings: number;
          user_id: string;
          week_start: string;
          weekly_budget_czk?: number | null;
        };
        Update: {
          allergens?: Database["public"]["Enums"]["allergen"][];
          appliances?: Database["public"]["Enums"]["appliance"][];
          categories?: Database["public"]["Enums"]["category"][];
          cooking_skill?: Database["public"]["Enums"]["cooking_skill"];
          created_at?: string;
          daily_kcal_target?: number | null;
          diet?: Database["public"]["Enums"]["diet"];
          disliked_ingredients?: string[];
          id?: string;
          max_prep_minutes?: number | null;
          meal_types?: Database["public"]["Enums"]["meal_type"][];
          note?: string | null;
          servings?: number;
          user_id?: string;
          week_start?: string;
          weekly_budget_czk?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      meal_steps: {
        Row: {
          id: string;
          meal_id: string;
          position: number;
          text: string;
        };
        Insert: {
          id?: string;
          meal_id: string;
          position: number;
          text: string;
        };
        Update: {
          id?: string;
          meal_id?: string;
          position?: number;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meal_steps_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          },
        ];
      };
      meals: {
        Row: {
          carbs_g: number;
          category: Database["public"]["Enums"]["category"];
          date: string;
          fat_g: number;
          id: string;
          kcal: number;
          meal_type: Database["public"]["Enums"]["meal_type"];
          name: string;
          plan_id: string;
          prep_minutes: number;
          protein_g: number;
        };
        Insert: {
          carbs_g?: number;
          category: Database["public"]["Enums"]["category"];
          date: string;
          fat_g?: number;
          id?: string;
          kcal?: number;
          meal_type: Database["public"]["Enums"]["meal_type"];
          name: string;
          plan_id: string;
          prep_minutes?: number;
          protein_g?: number;
        };
        Update: {
          carbs_g?: number;
          category?: Database["public"]["Enums"]["category"];
          date?: string;
          fat_g?: number;
          id?: string;
          kcal?: number;
          meal_type?: Database["public"]["Enums"]["meal_type"];
          name?: string;
          plan_id?: string;
          prep_minutes?: number;
          protein_g?: number;
        };
        Relationships: [
          {
            foreignKeyName: "meals_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "meal_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      preferences: {
        Row: {
          allergens: Database["public"]["Enums"]["allergen"][];
          appliances: Database["public"]["Enums"]["appliance"][];
          categories: Database["public"]["Enums"]["category"][];
          cooking_skill: Database["public"]["Enums"]["cooking_skill"];
          daily_kcal_target: number | null;
          diet: Database["public"]["Enums"]["diet"];
          disliked_ingredients: string[];
          max_prep_minutes: number | null;
          meal_types: Database["public"]["Enums"]["meal_type"][];
          servings: number;
          updated_at: string;
          user_id: string;
          weekly_budget_czk: number | null;
        };
        Insert: {
          allergens?: Database["public"]["Enums"]["allergen"][];
          appliances?: Database["public"]["Enums"]["appliance"][];
          categories?: Database["public"]["Enums"]["category"][];
          cooking_skill?: Database["public"]["Enums"]["cooking_skill"];
          daily_kcal_target?: number | null;
          diet?: Database["public"]["Enums"]["diet"];
          disliked_ingredients?: string[];
          max_prep_minutes?: number | null;
          meal_types?: Database["public"]["Enums"]["meal_type"][];
          servings?: number;
          updated_at?: string;
          user_id: string;
          weekly_budget_czk?: number | null;
        };
        Update: {
          allergens?: Database["public"]["Enums"]["allergen"][];
          appliances?: Database["public"]["Enums"]["appliance"][];
          categories?: Database["public"]["Enums"]["category"][];
          cooking_skill?: Database["public"]["Enums"]["cooking_skill"];
          daily_kcal_target?: number | null;
          diet?: Database["public"]["Enums"]["diet"];
          disliked_ingredients?: string[];
          max_prep_minutes?: number | null;
          meal_types?: Database["public"]["Enums"]["meal_type"][];
          servings?: number;
          updated_at?: string;
          user_id?: string;
          weekly_budget_czk?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          image: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          image?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          image?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      shopping_items: {
        Row: {
          checked: boolean;
          id: string;
          name: string;
          plan_id: string;
          total_quantity: number;
          unit: Database["public"]["Enums"]["unit"];
        };
        Insert: {
          checked?: boolean;
          id?: string;
          name: string;
          plan_id: string;
          total_quantity: number;
          unit: Database["public"]["Enums"]["unit"];
        };
        Update: {
          checked?: boolean;
          id?: string;
          name?: string;
          plan_id?: string;
          total_quantity?: number;
          unit?: Database["public"]["Enums"]["unit"];
        };
        Relationships: [
          {
            foreignKeyName: "shopping_items_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "meal_plans";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      allergen:
        | "GLUTEN"
        | "LACTOSE"
        | "EGGS"
        | "NUTS"
        | "PEANUTS"
        | "FISH"
        | "SHELLFISH"
        | "SOY"
        | "SESAME"
        | "CELERY"
        | "MUSTARD";
      appliance: "STOVE" | "OVEN" | "MICROWAVE" | "AIR_FRYER";
      category:
        | "QUICK"
        | "LOW_CALORIE"
        | "FAMILY_CLASSIC"
        | "HEALTHY_COMFORT"
        | "FAKEAWAY"
        | "EASY_TO_DIGEST"
        | "HIGH_PROTEIN"
        | "CZECH_CLASSIC";
      cooking_skill: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
      diet: "OMNIVORE" | "VEGETARIAN" | "VEGAN" | "PESCATARIAN";
      meal_type: "BREAKFAST" | "LUNCH" | "DINNER";
      unit: "G" | "ML" | "PCS";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      allergen: [
        "GLUTEN",
        "LACTOSE",
        "EGGS",
        "NUTS",
        "PEANUTS",
        "FISH",
        "SHELLFISH",
        "SOY",
        "SESAME",
        "CELERY",
        "MUSTARD",
      ],
      appliance: ["STOVE", "OVEN", "MICROWAVE", "AIR_FRYER"],
      category: [
        "QUICK",
        "LOW_CALORIE",
        "FAMILY_CLASSIC",
        "HEALTHY_COMFORT",
        "FAKEAWAY",
        "EASY_TO_DIGEST",
        "HIGH_PROTEIN",
        "CZECH_CLASSIC",
      ],
      cooking_skill: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      diet: ["OMNIVORE", "VEGETARIAN", "VEGAN", "PESCATARIAN"],
      meal_type: ["BREAKFAST", "LUNCH", "DINNER"],
      unit: ["G", "ML", "PCS"],
    },
  },
} as const;
