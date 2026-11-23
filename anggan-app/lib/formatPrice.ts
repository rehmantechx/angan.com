// Dealer-friendly prices, from the listing's real numeric price (n).
// Sale: Rs 6.5 Crore, Rs 1.65 Crore, Rs 36 Lac, Rs 1 Crore.
// Rent: Rs 39,000 / mo. Never invents a price, it only reformats n.
export function formatPrice(n: number, status: "sale" | "rent"): string {
  if (status === "rent") return "Rs " + n.toLocaleString("en-PK") + " / mo";
  if (n >= 10000000) {
    const c = n / 10000000;
    const s = Number.isInteger(c) ? String(c) : String(Math.round(c * 100) / 100);
    return "Rs " + s + " Crore";
  }
  if (n >= 100000) {
    const l = n / 100000;
    const s = Number.isInteger(l) ? String(l) : String(Math.round(l * 100) / 100);
    return "Rs " + s + " Lac";
  }
  return "Rs " + n.toLocaleString("en-PK");
}

export function whatsappFor(title: string, city: string, price: string): string {
  return (
    "https://wa.me/923041111698?text=" +
    encodeURIComponent("Hi Anngan, I am asking about " + title + ", " + city + ", " + price + ".")
  );
}
