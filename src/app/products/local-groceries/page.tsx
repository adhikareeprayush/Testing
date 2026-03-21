import { redirect } from "next/navigation";
export default function GroceriesPage() { redirect("/products?category=local-groceries"); }
